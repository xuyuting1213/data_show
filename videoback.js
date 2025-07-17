const data = {
    "parameter": {
        "roiList": []
    },
    "picture": "picture/20230613/20230613144252_722054_4_21_alarm.jpg",
    "srcUrl":
        "http://192.168.0.106:8081/files/originPicture/20230613/20230613144252_722054_4_21_src.jpg?serverUUID=3f16a3b113234807b81f6f8d0f268232",
    "resultData": {
        "classId": 1,
        "score": 0,
        "objectList": [
            {
                "classId": 0,
                "score": 0.727403,
                "scoreList": [
                    0.727403,
                    0.558674,
                    1
                ],
                "rect": {
                    "x": 1285,
                    "y": 804,
                    "width": 217,
                    "height": 265
                }
            }
        ]
    },
    "extraInfo": {},
    "result": "resultJson/20230613/20230613144252_722054_4_21_result.json?serverUUID=3f16a3b113234807b81f6f8d0f268232",
    "video": null,
    "other": "",
    "alarm": "picture/20230613/20230613144252_722054_4_21_alarm.jpg?serverUUID=3f16a3b113234807b81f6f8d0f268232",
    "src": "originPicture/20230613/20230613144252_722054_4_21_src.jpg?serverUUID = 3f16a3b113234807b81f6f8d0f268232",
    "alarmPicData": "",
    "alarmPicName": "20230613144252_722054_4_21_alarm.jpg",
    "srcPicName": "20230613144252_722054_4_21_src.jpg",
    "srcPicData": "",
    "imageHeight": 1080,
    "alarmUrl":
        "http://192.168.0.106:8081/files/picture/20230613/20230613144252_722054_4_21_alarm.jpg ? serverUUID = 3f16a3b113234807b81f6f8d0f268232",
    "taskId": 4,
    "cameraId": 21,
    "cameraUrl": "rtsp://192.168.0.74:3554/live/6",
    "cameraName": "10666",
    "timestamp": 1686638572,
    "imageWidth": 1920,
    "algorithmId": 4,
    "algorithmName": "行人闯入",
    "algorithmNameEn": "CR_PERSON_INVASION",
    "cameraDeviceForeignKey": null,
    "cameraDeviceType": 1,
    "cameraDeviceStreamUrl": "rtsp://192.168.0.74:3554/live/6",
    "cameraDeviceStatus": 1,
    "cameraDeviceGroup": "未分组",
    "cameraDeviceGps": "",
    "cameraDeviceName": "10666",
    "cameraDeviceId": 21,
    "dataID": "984f8f7809c611eeb9270242c0a8700d"
}
console.log(data)
module.exports = data;