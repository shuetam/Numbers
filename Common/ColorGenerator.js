const cellColors = [
    { main: [0, 0, 0, 0], under: [0, 0, 0, 0] }, //0
    { main: [255, 50, 50], under: [230, 30, 10] }, //1
    { main: [255,100,70], under: [230, 70, 35] }, //2
    { main: [155, 60, 70], under: [120, 40, 70] }, //3
    { main: [0, 170, 180], under: [0, 130, 140] }, //4
    { main: [75, 75, 255], under: [60, 50, 255] }, //5
    { main: [150, 50, 255], under: [123, 0, 255] }, //6
    { main: [255, 50, 150], under: [220, 20, 120] }, //7
    { main: [0, 180, 80], under: [0, 125, 50] }, //8
    { main: [210, 90, 0], under: [170, 70, 0] }, //9
]


export function getCellColor(value, color1, color2) {


    if (value < cellColors.length) {

        return cellColors[value];
    }
    else {
        return { 

            main: [(color1.main[0] + color2.main[0])/2, (color1.main[1] + color2.main[1])/2, (color1.main[2] + color2.main[2])/2 ], 
            under: [(color1.under[0] + color2.under[0])/2, (color1.under[1] + color2.under[1])/2, (color1.under[2] + color2.under[2])/2 ],
            newColor: true
        };

    }
}

