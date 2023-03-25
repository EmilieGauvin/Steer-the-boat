import * as THREE from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/build/three.module.js'
import resizeFullScreenGroup from './resizeFullScreenGroup'

export default function moveFullScreenGroup(fullScreenReturn){

    const objectGroups = fullScreenReturn.objectGroups
    const camera = fullScreenReturn.camera
    const cylinder = fullScreenReturn.cylinder
    const group = fullScreenReturn.group

    //Update cylinder position and rotation
    cylinder.position.copy(camera.position)
    cylinder.rotation.y = camera.rotation.y
    cylinder.rotation.x = camera.rotation.x + Math.PI*0.5
    cylinder.updateMatrixWorld();

    // find the point at distanceToCamera, at the orientation of the camera, to position and rotate the group
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera)
    const intersect = raycaster.intersectObject(cylinder)
    group.position.copy(intersect[0].point)
    group.rotation.x = camera.rotation.x
    group.rotation.y = camera.rotation.y

    // add the objects to display to the group
    for (const objectGroup of objectGroups)
    {
        objectGroup.object.updateMatrixWorld()
    }

    //Resize plane to window size and position objects
    resizeFullScreenGroup(fullScreenReturn)
}