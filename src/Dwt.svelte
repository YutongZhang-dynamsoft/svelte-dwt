<script>
  import dwt from 'dwt'
import { onMount } from 'svelte';

  let dwtObj = null
  let viewerObj = null

  let viewerWidth = '100%'
  let viewerHeight = '50vh'

  let fileFormat = [
    {id: 'pdf', text: 'pdf'},
    {id: 'jpg', text: 'jpg'},
    {id: 'tif', text: 'tif'}
  ]
  let selectFormat
  let fileName

  onMount( () => {
    
    init()
    // console.log(dwt)
  })

  async function init () {
    await mountDwt()
    bindViewer()
  }

  function mountDwt() {
    return new Promise((res, rej) => {
      const webTwainEnv = dwt.WebTwainEnv
      webTwainEnv.ProductKey = 't01016QAAADyBe7yfb9oPaRKoDodUi2D6w3Dj/XeSforvLiBX6PXItwyqx3NL/4Uso1U/t4Gol58RCjB9B1q+RjxJ2qOVHa1eGzRmGbzga3PGGn1/tDAWpk/DKsyhQmO9F1PDDdxIL+c='
      webTwainEnv.ResourcesPath = '/lib/dwt'
      webTwainEnv.AutoLoad = false
      webTwainEnv.IfAddMD5InUploadHeader = false
      webTwainEnv.IfConfineMaskWithinTheViewer = false
      webTwainEnv.Containers = [{ContainerId: 'dwt-container', Width: '100%', Height: '50vh'}]
      webTwainEnv.CreateDWTObjectEx(
        { WebTwainId: 'dwt-obj' },
        (obj) => {
          console.log('dwt instance created')
          dwtObj = obj
          res(obj)
        },
        (errStr) => {
          console.error(`dwt init error, ${errStr}`)
          rej(errStr)
        }
      )
    })    
  }

  function acquireImage() {
    const DWObject = dwtObj
    if (DWObject) {
      if (DWObject.UseLocalService) {
        let configure = {
          IfShowUI: this.showUI,
          PixelType: this.colorMode,
          Resolution: this.resolution,
          IfFeederEnabled: this.autoFeeder,
          IfDuplexEnabled: this.duplex,
          IfDisableSourceAfterAcquire: true,
          // Advance settings
          IfGetImageInfo: true,
          IfGetExtImageInfo: true,
          extendedImageInfoQueryLevel: 0
        }
        DWObject.SelectSourceByIndex(this.selectScanner)
        DWObject.AcquireImage(
          configure,
          () => { DWObject.CloseSource() },
          () => { DWObject.CloseSource() }
        )
      }
    }
  }

  function bindViewer () {
    let options = {
      width: viewerWidth,
      height: viewerHeight,
      view: {
        bShow: true,
        Width: viewerWidth,
        Height: viewerHeight
      }
    }
    if (dwtObj.BindViewer('dwt-container', options)) {
      viewerObj = dwtObj.Viewer
      console.log('viewer binded')
    }
  }

  function Upload() {
    printUpload()
    const host = '127.0.0.1'
    const protocol = 'http'
    const uploadPath = '/api/File'
    let uploadFileName = fileName + '.' + selectFormat
    const port = 51065

    let format = (select => {
              switch (select) {
                case 'jpg': { return dwt.EnumDWT_ImageType.IT_JPG }
                case 'pdf': { return dwt.EnumDWT_ImageType.IT_PDF }
                case 'tif': { return dwt.EnumDWT_ImageType.IT_TIF }
            }
        })(selectFormat.id)

        console.log(format)

    let uploadFormat = dwt.EnumDWT_UploadDataFormat.Binary

    const DWObj = dwtObj
    if (DWObj) {
        DWObj.HTTPPort = port
        DWObj.IfSSL = false
        let indices = DWObj.SelectedImagesIndices
        DWObj.HTTPUpload(
            // protocol + '//' + host + ':' + port + uploadPath,
            'http://localhost:5000/api/File',
            indices,
            format,
            uploadFormat,  // 0 for binary; 1 for base64
            uploadFileName,
            () => { alert('success') },
            (errCode, errStr, res) => {
                console.error(`${errCode}: ${errStr}. Server return: ${ res }`)
            }
        )
    }
  }
  function printUpload() {
      console.log(`to upload: ${fileName}.${selectFormat.id}`)
    }
</script>

<div id="dwt-container" style="width: {viewerWidth}; height:{viewerHeight}">
  
</div>
<div id="dwt-control">
  <button on:click={acquireImage}>Scan</button>
  <div>
    <input placeholder="file name" type="text" bind:value={fileName}>
    <select bind:value={selectFormat} >
      {#each fileFormat as format}
        <option value={format}>{format.text}</option>
      {/each}
    </select>
    <button on:click={Upload}>Upload</button>
  </div>
</div>