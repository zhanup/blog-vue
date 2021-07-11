// 节流函数
function throttle (fn, delay) {
    let t = null,
        begin = new Date().getTime();
        
    return function () {
        let _self = this,
            args = arguments,
            cur = new Date().getTime();

        clearTimeout(t);

        if (cur - begin >= delay) {
            fn.apply(_self, args);
            begin= cur;
        } else {
            t = setTimeout(function () {
                fn.apply(_self, args);
            }, delay);
        }
    }
}

// 防抖函数
function debounce (fn, delay) {
    let timer = null;
  
    return function (...args) {
        if (timer) {
            clearTimeout(timer);
        }
        
        timer = setTimeout (function () {
            fn.apply(this, args);
        }, delay);
    }
}

function format(num) {
    return num.toString().padStart(2, 0);
}

/*
[
    { "date": "2021-01-01" },
    { "date": "2021-02-01" }
]
将上面这种数据结构转为以下
{
    "2021": {
        "01": [
            { "date": "2021-01-01" },
        ],
        "02": [
            { "date": "2021-02-01" }
        ]
    }
}
*/
function changStructure(arr) {
    let years = []
    let classifyByYear = {}
    let classifyByYearMonth = {}

    arr.forEach(i => {
        years = [...new Set([...years, i.date.slice(0, 4)])]
    })

    years.forEach(i => {
        arr.forEach(j => {
            if (i === j.date.slice(0, 4)) {
                if (!classifyByYear[i]) {
                    classifyByYear[i] = []
                }
                classifyByYear[i].push(j)
            }
        })
    })

    Object.keys(classifyByYear).forEach(key => {
        let months = []
        classifyByYear[key].forEach(i => {
            months = [...new Set([...months, i.date.slice(5, 7)])]
        })

        months.forEach(i => {
            classifyByYear[key].forEach(j => {
                if (i === j.date.slice(5, 7)) {
                    if (!classifyByYearMonth[key]) {
                        classifyByYearMonth[key] = {}
                    }
                    if (!classifyByYearMonth[key][i]) {
                        classifyByYearMonth[key][i] = []
                    }
                    classifyByYearMonth[key][i].push(j)
                }
            })
        })
    })

    return classifyByYearMonth;
}
  

export { throttle, debounce, format, changStructure }
