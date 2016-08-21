(function ($){

    /**
     * returns an array of all dates between two dates inclusive
     * @param  {date} start [description]
     * @param  {date} end   [description]
     * @return {array<date>}       [description]
     */
    function getAllDays(start, end) {
        var dates = [];

        while(start <= end) {
            dates.push(start);
            start = new Date(start.setDate(
                start.getDate() + 1
            ));
        }

        return dates;
    }

    // Setupt the default schedules
    var normalA = {
        name: "normal A schedule",
        days: ["wed"],
        periods: [
            {
                name:   "0A",
                start:  "8:10",
                end:    "9:40"
            },
            {
                name:   "1st",
                start:  "9:45",
                end:    "11:20"
            },
            {
                name:   "lunch",
                start:  "11:20",
                end:    "12:10"
            },
            {
                name:   "2nd",
                start:  "12:15",
                end:    "13:45"
            },
            {
                name:   "FIT",
                start:  "13:50",
                end:    "14:15"
            },
            {
                name:   "3rd",
                start:  "14:20",
                end:    "15:50s"
            }
        ]
    };

    var normalB = {
        name: "normal B schedule",
        days: ["tue", "thu"],
        periods: [
            {
                name:   "0B",
                start:  "8:10",
                end:    "9:40"
            },
            {
                name:   "5th",
                start:  "9:45",
                end:    "11:20"
            },
            {
                name:   "lunch",
                start:  "11:20",
                end:    "12:10"
            },
            {
                name:   "6th",
                start:  "12:15",
                end:    "13:45"
            },
            {
                name:   "FIT",
                start:  "13:50",
                end:    "14:15"
            },
            {
                name:   "7th",
                start:  "14:20",
                end:    "15:50s"
            }
        ]
    };

    var advisory = {
        name: "forum schedule",
        days: ["mon"],
        periods: [
            {
                name:   "0A",
                start:  "8:10",
                end:    "9:40"
            },
            {
                name:   "1st",
                start:  "9:45",
                end:    "11:20"
            },
            {
                name:   "lunch",
                start:  "11:20",
                end:    "12:10"
            },
            {
                name:   "2nd",
                start:  "12:15",
                end:    "13:45"
            },
            {
                name:   "Forum",
                start:  "13:50",
                end:    "14:15"
            },
            {
                name:   "3rd",
                start:  "14:20",
                end:    "15:50s"
            }
        ]
    };

    var lateStart = {
        name: "late start schedule",
        days: [],
        periods: [
            {
                name:   "staff meetings",
                start:  "8:00",
                end:    "9:50"
            },
            {
                name:   "5th",
                start:  "10:00",
                end:    "11:15"
            },
            {
                name:   "0B",
                start:  "11:20",
                end:    "12:30"
            },
            {
                name:   "lunch",
                start:  "12:30",
                end:    "13:05"
            },
            {
                name:   "6th",
                start:  "13:10",
                end:    "14:20"
            },
            {
                name:   "7th",
                start:  "14:25",
                end:    "15:40"
            }
        ]
    };

    var genericFriday = {
        name: "friday A/B",
        days: ["fri"],
        periods: [
            {
                name:   "0A/0B",
                start:  "8:10",
                end:    "9:40"
            },
            {
                name:   "1st/5th",
                start:  "9:45",
                end:    "11:20"
            },
            {
                name:   "lunch",
                start:  "11:20",
                end:    "12:10"
            },
            {
                name:   "2nd/6th",
                start:  "12:15",
                end:    "13:45"
            },
            {
                name:   "FIT",
                start:  "13:50",
                end:    "14:15"
            },
            {
                name:   "3rd/7th",
                start:  "14:20",
                end:    "15:50s"
            }
        ]
    };

    var noSchool = {name: 'noschool',
        periods: genericFriday.periods
    };

    var week = {
        "mon" : advisory,
        "tue" : normalB,
        "wed" : normalA,
        "thu" : normalB,
        "fri" : genericFriday,
        "sat" : noSchool,
        "sun" : noSchool
    };

    var daysOff = [];

    // Summer
    var summerStart = new Date(2015, 6, 4);
    var summerEnd = new Date(2015, 7, 22);

    var laborDay = new Date(2015, 8, 7);

    daysOff.push(getAllDays(summerStart, summerEnd));
    daysOff.push(laborDay);



    $(document).ready(function() {
        updateHTML();
        setInterval(updateHTML, 100);
    });

    function updateHTML() {
        var $minsRemainingLbl = $('.mins-remaining');
        $minsRemainingLbl.text(minsRemaining());

        if(currentSchedule() === noSchool || currentPeriod() === noSchool){
            $(".in-schedule").hide();
            $(".no-schedule").show();
            $(".lower .title").text("normal schedule");
        } else {
            $(".in-schedule").show();
            $(".no-schedule").hide();
            $(".lower .title").text("today\'s schedule");
        }

        updateScheduleHTML();

        // Update Schedule Info
        $(".cur-schedule").text(currentSchedule().name);

        // Update Period Info

        // Current Period
        var curPeriod = currentPeriod();

        $("#in").text(curPeriod.name);
        $("#started").text(convertTime(curPeriod.start));

        // Next Period
        if(nextPeriod() === noSchool)  {
            $("#next").html("nothing");
            $("#at").html(convertTime(curPeriod.end));
        } else {
            $("#next").text(nextPeriod().name);
            $("#at").text(convertTime(nextPeriod().start));
        }

    }

    function updateScheduleHTML() {
        var curSchedule = currentSchedule();
        var $lowerItems = $(".lower");
        $lowerItems.html("");
        var $schedule = "";
        $.each(curSchedule.periods, function(i, period) {
            var periodHTML = '<div class="period"> <div class="container"> <p class="name">'+formatPeriodName(period.name)+'</p> <div class="detail"> <p class="times">'+convertTime(period.start) + ' – ' + convertTime(period.end) + '</p> <p class="length">' + periodLength(period) + ' minutes</p></div> </div></div>';
            $lowerItems.append(periodHTML);
         });
    }

    function minsRemaining() {
        var curPeriod = currentPeriod();

        if (curPeriod.name === "noschool") {
            return 0;
        }

        var curTime = currentTime();
        var remaining = parseTime(curPeriod.end) - curTime;

        return remaining;
    }

    function periodLength(period){
        return parseTime(period.end) - parseTime(period.start);
    }

    function currentPeriod() {
        var curTime = currentTime();
        var curSchedule = currentSchedule();
        if(curSchedule === noSchool){
            return noSchool;
        }
        var curPeriod = noSchool;
            $.each(curSchedule.periods, function(i, period) {
                var start = parseTime(period.start);
                var end = parseTime(period.end);
                if(curTime >= start && curTime < end){
                    curPeriod = period;
                    return false;
                }
            });
        return curPeriod;

    }

    function nextPeriod() {
        var curPeriod = currentPeriod();
        var curSchedule = currentSchedule();
        var periodIndex = $.inArray(curPeriod, curSchedule.periods);

        if(periodIndex === -1 || periodIndex === curSchedule.periods.length - 1) {
            return noSchool;
        }

        return curSchedule.periods[periodIndex+1];
    }

    function inSchool() {

    }

    /**
     * parses time string to total minutes in the day
     * @param  {string} time
     * @return {int}
     */
    function parseTime(time) {
        var split = time.split(":");
        var hours = parseInt(split[0], 10);
        var minutes = parseInt(split[1], 10);

        //total mintues so far
        var totalTime = hours*60 + minutes;

        return totalTime;
    }

    /**
     * converts a 24 hour time string to a 12 hour time string
     * @param  {string} time 24 hour time string in the format `hh:mm`
     * @return {string}      12 hour time string in the format `hh:mm`
     */
    function convertTime(time) {
        var split = time.split(':');
        var hour = parseInt(split[0], 10);
        if(hour > 12) {
            hour = hour%12;
        }
        return hour + ":" + split[1];
    }

    function currentTime() {
        var d = new Date();
        return d.getHours()*60 + d.getMinutes();
    }

    function currentSchedule() {
        var days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
        var d = new Date();

        if($.inArray(d, daysOff) !== -1) {
            return noSchool;
        }

        var todayInt = d.getDay();
        // console.log(todayInt);
        var today = days[todayInt];

        return week[today];
    }

    function formatPeriodName(period) {
        if (/^\d.*/.test(period)) {
            return period + " period";
        }
        return period;
    }

})(jQuery);
