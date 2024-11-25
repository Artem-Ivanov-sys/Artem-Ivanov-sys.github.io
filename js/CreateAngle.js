export function createAngle(point1, point2) {
    return Math.acos((point1[0]-point2[0])/Math.sqrt((point1[0]-point2[0])**2+(point1[1]-point2[1])**2))
}