import visibleHeightAtZDepth from './visibleHeightAtZDepth.js'
import visibleWidthAtZDepth from './visibleWidthAtZDepth.js'

export default function resizeFullScreenGroup(fullScreenReturn){

    const objectGroups = fullScreenReturn.objectGroups
    const plane = fullScreenReturn.plane
    const camera = fullScreenReturn.camera
    const distanceToCamera = fullScreenReturn.distanceToCamera

    //Scale plane to window sizes
    plane.scale.set(
        visibleWidthAtZDepth(distanceToCamera, camera),
        visibleHeightAtZDepth(distanceToCamera, camera),
        1)

    //Position objects according to window coordinates
    for (const objectGroup of objectGroups)
    {
        objectGroup.object.position.set(
            objectGroup.X * visibleWidthAtZDepth(distanceToCamera, camera),
            objectGroup.Y * visibleHeightAtZDepth(distanceToCamera, camera),
            objectGroup.Z * 1
        )
        objectGroup.object.updateMatrixWorld()
    }
}