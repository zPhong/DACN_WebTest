const defineSentences = {
    segment :[
        '{segment} = {distance}',
        '{segment} song song {segment}',
        '{segment} vuông góc {segment}',
        '{segment} cắt {segment} tại {point}',
        '{segment} giao {segment} tại {point}',
        '{segment} phân giác {angle}',
        '{segment} + {segment} = {segment}',
        '{segment} + {segment} = {distance}',
        '{segment} - {segment} = {segment}',
        '{segment} - {segment} = {distance}',
        "{segment} = {value} {segment}",
    ],
    point:[
        "{point},{point},{point} thẳng hàng",
        '{point} trung điểm {segment}',
        "{point} thuộc {segment}",
        "{point} nằm giữa {segment}",
        "{point} nằm giữa {point},{point}",
        "{point} không thuộc {segment}"
    ],
    angle:[
        "{angle} = {radius}",
        "{angle} = {value} {angle}"
    ],
    line:[
        'đường thẳng {d}',
    ],
    ray:[
        "tia {ray}"
    ],
    shape:[
        "tam giác {type} {triangle}",
        "tứ giác {quadrilateral}",
        "hình thang {type} {trapezoid}",
        "hình bình hành {parallelogram}",
        "hình chữ nhật {rectangle}",
        "hình thoi {rhombus}",
        "hình vuông {square}"
    ]
}


export default defineSentences;