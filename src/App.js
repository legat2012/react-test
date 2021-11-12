import './App.css';
import endOfYear from 'date-fns/endOfYear';
import getYear from 'date-fns/getYear';
import {useCallback} from "react";

const histogramRows = [
    {
        id: 1,
        dateFrom: 'Wed, 01 Oct 2019 07:59:00 GMT',
        dateTo: 'Wed, 01 Dec 2020 07:59:00 GMT',
        background: 'blue',
    },
    {
        id: 2,
        dateFrom: 'Wed, 01 May 2020 07:59:00 GMT',
        dateTo: 'Wed, 03 Jun 2021 07:59:00 GMT',
        background: 'green',
    },
    {
        id: 3,
        dateFrom: 'Wed, 01 Apr 2020 07:59:00 GMT',
        dateTo: 'Wed, 03 Dec 2022 07:59:00 GMT',
        background: 'red',
    },
    {
        id: 4,
        dateFrom: 'Wed, 21 Apr 2021 07:59:00 GMT',
        dateTo: 'Wed, 03 Dec 2021 07:59:00 GMT',
        background: 'brown',
    },
    {
        id: 5,
        dateFrom: 'Wed, 01 Feb 2021 07:59:00 GMT',
        dateTo: 'Wed, 03 Dec 2024 07:59:00 GMT',
        background: 'yellow',
    },
];

const period = (dateTo, dateFrom) => {
    return Date.parse(dateTo) - Date.parse(dateFrom);
};

const yearInMs = 31536000000; // Длина года в миллисекундах

const App = () => {
    // преобразуем массив добавлением дат в миллисекундах и периода
    const histogramsWithPeriod = useCallback(() =>
        histogramRows.map((item) => ({
            ...item,
            dateFromMs: Date.parse(item.dateFrom),
            dateToMs: Date.parse(item.dateTo),
            period: period(item.dateTo, item.dateFrom)
        })), [])

    // находим объект с минимальной датой от
    const objWithMinDateFrom = useCallback(() =>
        histogramsWithPeriod().reduce((prev, current) =>
            prev.dateFromMs < current.dateFromMs ? prev : current
        ),[histogramsWithPeriod])

    // находим объект с максимальной датой до
    const objWithMaxDateTo = useCallback(() =>
        histogramsWithPeriod().reduce((prev, current) =>
            prev.dateToMs > current.dateToMs ? prev : current
        ), [histogramsWithPeriod])

    // находим длину максимального периода в мс
    const maxPeriodInMs = useCallback(() => objWithMaxDateTo().dateToMs - objWithMinDateFrom().dateFromMs, [objWithMaxDateTo.dateToMs, objWithMinDateFrom.dateFromMs])

    // находим число мс в одном проценте
    const numberOfMsInPercent = useCallback(() => maxPeriodInMs() / 100, [maxPeriodInMs])

    // вычисляем массив объектов { width (проценты), year(число) }
    const yearsIntervals = useCallback(() => {
        const intervals = []
        let yearValue
        let restPeriod

        const firstYearWidth =
            Date.parse(endOfYear(new Date(objWithMinDateFrom().dateFrom)).toISOString(),
            ) - objWithMinDateFrom().dateFromMs;

        yearValue = getYear(new Date(objWithMinDateFrom().dateFrom));

        // пушим первый год
        intervals.push({
            width: `${(firstYearWidth / numberOfMsInPercent()).toFixed()}%`,
            year: yearValue,
        });

        restPeriod = maxPeriodInMs() - firstYearWidth;

        // пушим года между первым и последним
        while (restPeriod > yearInMs) {
            yearValue++;
            intervals.push({
                width: `${(yearInMs / numberOfMsInPercent()).toFixed()}%`,
                year: yearValue,
            });
            restPeriod = restPeriod - yearInMs;
        }

        // пушим последний год
        const lastYearWidth = restPeriod;

        intervals.push({
            width: `${(lastYearWidth / numberOfMsInPercent()).toFixed()}%`,
            year: yearValue + 1,
        });

        return intervals;
    }, [maxPeriodInMs, numberOfMsInPercent, objWithMinDateFrom]);

    // гистограммы с данными для инлайн стилей
    const histogramsWithPercents = useCallback(() => {
        return histogramsWithPeriod().map((item) => ({
            ...item,
            background: item.background,
            width: `${(item.period / numberOfMsInPercent()).toFixed()}%`,
            left: `${(
                (item.dateFromMs - objWithMinDateFrom().dateFromMs) /
                numberOfMsInPercent()
            ).toFixed()}%`,
        }));
    }, [histogramsWithPeriod, numberOfMsInPercent, objWithMinDateFrom]);

    return (
        <>
            <div className="HeaderWrap">
                {yearsIntervals().map((item, idx) => {
                    return (
                        <div
                            key={idx}
                            style={{
                                width: item.width
                            }}
                        >
                            <div
                                className="HeaderItem"
                            >
                                {item.year}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="BodyWrap">
                {histogramsWithPercents().map((item, index) => {
                    return (
                        <div
                            className="BodyHistogram"
                            key={index}
                            style={{
                                backgroundColor: item.background,
                                width: item.width,
                                marginLeft: item.left,
                            }}
                        />
                    );
                })}
            </div>
        </>
    );
}

export default App;
