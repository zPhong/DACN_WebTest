const defineSentences = {
    define:[
        '{object} + {object} = {value}',
        '{object} - {object} = {value}',
        '{object} = {value} * {object}',
        '{object} = {value}'
    ],
    relation :[
        '{object} song song {object}',
        '{object} vuông góc {object}',
        '{object} cắt {object} tại {point}',
        '{object} phân giác {angle}',
    ],
    point:[
        "{arrayPoints} thẳng hàng",
        '{point} trung điểm {segment}',
        "{point} thuộc {segment}",
        "{point} không thuộc {segment}"
    ],
    shape:[
        "tam giác {type triangle}",
        "tứ giác {quadrilateral}",
        "hình thang {type trapezoid}",
        "hình bình hành {parallelogram}",
        "hình chữ nhật {rectangle}",
        "hình thoi {rhombus}",
        "hình vuông {square}",
        "đường tròn tâm {point}"
    ]
}

const validate = {
    object: {
        define:['angle','segment'],
        relation:['ray','line','segment']
    },
    point: {length: 1, format: "1" },
    segment: {length : 2,format :"11"},
    angle: {length:3},
}


export {validate, defineSentences};