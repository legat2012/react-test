На вход поступает массив объектов:

```
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
```

На основании этих данных необходимо построить гистрограмму, 
где каждая строка цвета background попадает в общий период по всем объектам.
Период начинается с самой ранней даты dateFrom объекта массива, 
а заканчивается самой поздней dateTo. 
Скриншот примерного макета в /assets/gantt.png
