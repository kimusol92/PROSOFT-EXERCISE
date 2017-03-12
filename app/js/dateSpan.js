var daysCounter = 0;
var weekDays = ["S", "M", "T", "W", "T", "F", "S"];


function renderCalendarTable() {

  var tbody = document.querySelector('#tblCalendar tbody');
  tbody.innerHTML = ''; //
  var country = document.getElementById("txtCountryCode").value;
  var dateStr = document.getElementById("txtDate").value;
  var days = document.getElementById("txtDays").value;
  var date = new Date(dateStr);
  date.setDate(date.getDate() + 1);
  var endDate = new Date();


  endDate.setTime(date.getTime() + days * 86400000);

  //Get the number of months between startDate and endDate
  var monthsCount = (endDate.getMonth() + 1) - date.getMonth() + (12 * (endDate
    .getFullYear() -
    date.getFullYear()));

  var row = tbody.insertRow(0);
  for (var i = 0; i < monthsCount; i++) {
    var column = row.insertCell(i);
    column.appendChild(createMonthTable(date, days, country));

  }

  daysCounter = 0;
}

function createMonthTable(date, days, country) {

  var startWeekDay = date.getDay() - 1;
  var table = document.createElement('table');
  //create header
  var trHeader = document.createElement('tr');
  for (var headerDay = 0; headerDay < 7; headerDay++) {
    var th = document.createElement('th'); // TABLE HEADER.
    th.innerHTML = weekDays[headerDay];
    trHeader.appendChild(th);
  }
  table.appendChild(trHeader);



  loop1: while (daysCounter < days) {

      for (var rowCount = 0; rowCount < 4; rowCount++) {
        var tr = document.createElement('tr');
        var today = 0;
        for (var columnCount = 0; columnCount < 7; columnCount++) {
          var td = document.createElement('td');

          //if is a day previous to the Start date
          if (rowCount == 0 && columnCount <= startWeekDay) {
            td.classList.add('invalid');

          } else {
            td.appendChild(document.createTextNode(date.getDate()));

            if (isHoliday(country, date)) {
              td.classList.add('holiday');
            }
            //if day is weekend
            if (date.getDay() == 6 || date.getDay() == 0) {
              td.classList.add('weekend');
            } else {
              td.classList.add('weekdays');
            }
            today = date.getDate();
            date.setDate(date.getDate() + 1);
            daysCounter++;
          }
          tr.appendChild(td);
          if (today > date.getDate() || daysCounter >= days) {
            table.appendChild(tr);
            break loop1;
          }
        } //for columnCount
        table.appendChild(tr);
      } //for rowCount
    } //loop


  return table;

}

function isHoliday(country, date) {

  var day = date.getUTCDate();
  var month = date.getUTCMonth();
  var year = date.getUTCFullYear();

  //AJAX call to holidayapi
  $.ajax({
    url: 'https://holidayapi.com/v1/holidays?key=dc9a1c52-fdd6-4b32-aae7-79b60beca326&country=' +
      country + '&year=' + year + '&month=' + (month + 1) + "&day=" + day,
    type: 'get',
    dataType: 'json',
    success: function(data) {
      var isAHoliday = false;
      if (data.holidays.length > 0) {
        isAHoliday = true;
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('ERROR calling holidayapi. Error: ' + textStatus);
    }
  });

}
