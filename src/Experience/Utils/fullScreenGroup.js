import * as THREE from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/build/three.module.js'
import resizeFullScreenGroup from './resizeFullScreenGroup'

export default function fullScreenGroup(objectGroups, camera, distanceToCamera, scene, visible){

    // Cylinder with camera at center, and radius of distanceToCamera
    const cylinder = new THREE.Mesh(
        new THREE.CylinderGeometry(
            distanceToCamera, 
            distanceToCamera, 
            0.08, 16), 
        new THREE.MeshBasicMaterial({
            color: 'red',
            side:THREE.DoubleSide, 
            visible: false,
        }))
    cylinder.position.copy(camera.position)
    cylinder.rotation.y = camera.rotation.y
    cylinder.rotation.z = Math.PI*0.5
    cylinder.rotation.x = camera.rotation.x + Math.PI*0.5
    cylinder.updateMatrixWorld();
    scene.add(cylinder)

    //Create plane of 1x1 geometry, inside group
    const group = new THREE.Group()
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(
            1,
            1),
        new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            visible: visible,
            opacity: 0.2,
            transparent: true
        })
    )
    group.add(plane)
    scene.add(group)

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
        group.add(objectGroup.object)
    }
    
    const fullScreenReturn = { plane, group, cylinder, objectGroups, plane, camera, distanceToCamera}

    //Resize plane to window size and position objects
    resizeFullScreenGroup(fullScreenReturn)

    return fullScreenReturn
}