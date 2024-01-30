function calculateImageSize(originalWidth, originalHeight) {
    const ratio = originalWidth / originalHeight

    const w = originalWidth > width ? width : originalWidth
    const h = w / ratio

    return {
      width: w,
      height: h,
      originalWidth,
      originalHeight
    }
  }

  function calculateFaceRectInsideImage(boundingBox, imageSize) {
    const wRatio = imageSize.originalWidth / imageSize.width
    const hRatio = imageSize.originalHeight / imageSize.height

    const faceX = boundingBox[0] / wRatio
    const faceY = boundingBox[1] / hRatio

    const faceWidth = boundingBox[2] / wRatio - faceX
    const faceHeight = boundingBox[3] / hRatio - faceY

    return {
      x: faceX,
      y: faceY,
      width: Math.ceil(faceWidth),
      height: Math.ceil(faceHeight)
    }
  }

  const callFaceFeature = faces => {
    if (faces.length > 0) {
      console.log(faces, 'hello faces ===>>>>>>>>>>>>>.')
      setProfileApproved(true)
    } else {
      setProfileApproved(false)
      alert('Please use a profile pic with better face exposure')
    }
  }

  useEffect(() => {
    const processImage = async () => {
      if (imageObject && imageObject.path) {
        setLoading(true)
        const options = {
          landmarkMode: FaceDetectorLandmarkMode.ALL,
          contourMode: FaceDetectorContourMode.ALL
        }

        const faces = await FaceDetection.processImage(
          imageObject.path,
          options
        )

        console.log(faces, 'hello faces ====>>>>>>>>>>')

        if (faces.length === 0) {
          alert("We didn't detected any face")
          setProfileApproved(false)
        } else if (faces.length > 1) {
          alert('We detected more than one face')
          setProfileApproved(false)
        } else {
          callFaceFeature(faces)
        }

        const imageSizeResult = calculateImageSize(
          imageObject.width,
          imageObject.height
        )

        const faceRectResults = []

        faces.forEach(face => {
          const faceRect = calculateFaceRectInsideImage(
            face.boundingBox,
            imageSizeResult
          )

          faceRectResults.push(faceRect)
        })

        console.log(faceRectResults, 'face rect results ===>>>>>>>>>>>')
        setLoading(false)
      }
    }

    processImage()
  }, [imageObject])
