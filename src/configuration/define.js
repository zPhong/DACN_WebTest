const defineSentences = {
    define: [
        '{object} + {object} = {object}',
        '{object} - {object} = {object}',
        '{object} = {value} * {object}',
        '{object} = {object}'
    ],
    relation: [
        '{object} song song {object}',
        '{object} vuông góc {object}',
        '{object} cắt {object} tại {point}',
        '{object} phân giác {angle}',
        "{arrayPoints} thẳng hàng",
        '{point} trung điểm {segment}',
        "{point} thuộc {object}",
        "{point} không thuộc {object}"
    ],
    shape: [
        "tam giác {type triangle}",
        "tứ giác {quadrilateral}",
        "hình thang {type trapezoid}",
        "hình bình hành {parallelogram}",
        "hình chữ nhật {rectangle}",
        "hình thoi {rhombus}",
        "hình vuông {square}",
        "đường tròn tâm {circle}"
    ]
}

const validate = {
    object: {
        define: ['angle', 'segment'],
        relation: ['ray', 'line', 'segment']
    },
    point: { length: 1, format: "1" },
    segment: { length: 2, format: "11" },
    angle: { length: 3 },
    shape: {
        triangle: { length: 3, format: '111' },
        quadrilateral: { length: 4, format: '1111' },
        trapezoid: { length: 4, format: '1111' },
        parallelogram: { length: 4, format: '1111' },
        rectangle: { length: 4, format: '1111' },
        rhombus: { length: 4, format: '1111' },
        square: { length: 4, format: '1111' },
        circle: { length: 1, format: '1' },
    },
    shapeType: {
        triangle: ['', 'vuông', 'cân', 'vuông cân', 'đều'],
        trapezoid: ['', 'vuông', 'cân']
    }
}


export { validate, defineSentences };