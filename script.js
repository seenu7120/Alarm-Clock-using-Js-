function displayCurrTime(){
    const currTime=new Date()
    document.getElementById("curr-date").innerText=currTime.toDateString()
    document.getElementById("curr-time").innerText=currTime.toLocaleTimeString("en-US",{
        timeZone:"Asia/Kolkata",
        hour12 : true,
        hour:  "2-digit",
        minute: "2-digit",
        second: "2-digit"
     })
   
    let currTimeId=setTimeout('displayCurrTime()',1000)
}
const alarmSound=new Audio();
alarmSound.src="./Cock-Morning.mp3" ;

//.....................................................................

class AlarmClock{

    constructor(){
        this.alarms = []
        /*
        [{
            id: uniqueID,
            time: "",
            on: true,
            snoozeRemaining:3
        },{}]
        */
    }

    getAlarms(){
        return this.alarms;
    }

    setAlarm(time){
        const alarm = {
            id: uniqueID(),
            time: formatTime(time),
            on: true,
            snoozeRemaining: 3
        }
        this.alarms.push(alarm)

        refreshUI();
    }

    deleteAlarm(id){
        this.alarms = this.alarms.filter((alarm)=> alarm.id!==id)
        alarmClock.stopAlarm(id);
        refreshUI()
    }

    snoozeAlarm(id, cancel=false){
        this.alarms.map((alarm)=>{
            if(id===alarm.id){
                const para = document.getElementById(id).getElementsByTagName("p")[0];
               
                if(alarm.snoozeRemaining===0 || cancel){
                    const newTime = Date.now(alarm.time) + 7*24*60*60*1000 - 5*(3-alarm.snoozeRemaining)*60*1000;
                    alarm.time = formatTime(new Date(newTime))
                    alarm.snoozeRemaining=3;
                    alarmClock.stopAlarm(alarm.id)
                   
                }else{
                    para.innerText = "Snoozing for 5 mins"            
                    const newTime = Date.now(alarm.time) + 5*60*1000;
                    alarm.time = formatTime(new Date(newTime))
                    alarm.snoozeRemaining = alarm.snoozeRemaining-1;
                    alarmClock.stopAlarm(alarm.id)
                }

                setTimeout(()=>refreshUI(),5000)
            }
            return alarm;
        })
    }

    playAlarm(id){
        console.log(`Alarm with id ${id} is playing`)
        alarmSound.loop = true;
        alarmSound.play()
    }
    stopAlarm(id){
        console.log(`Alarm with id ${id} is stopped`)
        alarmSound.pause()
        alarmSound.currentTime=0;
    }

}
///..............................................................

const alarmClock = new AlarmClock()

//.....................................................................

const addAlarmBtn = document.getElementById("submit")
const alarmDay = document.getElementById("day")
const alarmTime = document.getElementById("time")
const alarms = document.getElementById("alarms")

//....................................................................
addAlarmBtn.addEventListener("click",function(){
    // console.log(alarmTime.value,alarmDay.value)

    const hh = parseInt(alarmTime.value.split(":")[0])
    const min = parseInt(alarmTime.value.split(":")[1])

    const currDate = new Date().getDate()
    const currDay = new Date().getDay()
    const currHours = new Date().getHours()
    const currMins = new Date().getMinutes()
    const currYear = new Date().getFullYear()
    const currMonth = new Date().getMonth()

    let date = currDate - currDay + parseInt(alarmDay.value)
    if(date<currDate || (date===currDate && (hh<currHours || (hh===currHours && min<=currMins)))){
        date=date+7
    }
    let timeForAlarm = new Date(currYear,currMonth,date, hh,min,0,0);
    alarmClock.setAlarm(timeForAlarm)

}) 

// ............................................................................


function uniqueID(){
    return Math.floor(Math.random()*Date.now())  // gives curr time in milliseconds & multiply by random number => unique id
}

const formatTime = (time) => {
    const newTime = new Date(time).setMilliseconds(0);
    return new Date(newTime).setSeconds(0)
}

const refreshUI = () => {
    alarms.innerHTML = "";

    const sortedAlarms = alarmClock.getAlarms().sort(function(a,b){
        return new Date(a.time) - new Date(b.time)
    })

    sortedAlarms.forEach((alarm)=>{
        addAlarmToUI(alarm.time,alarm.id)
    })
}

//.....................................................................
const isTimeSame = (time1,time2) => {
    if(formatTime(new Date(time1))=== formatTime(new Date(time2))){
        return true;
    }else{
        return false;
    }
}

function handleSnoozeCancel(e,alarm){
    const snoozeOrCancel = e.key;

    // if(snoozeOrCancel==="s"){
    //     alarmClock.snoozeAlarm(alarmId)
    if(snoozeOrCancel==="c"){
        window.alert(`Alarm ${new Date(alarm.time).toLocaleTimeString()} is cancelled and set to next week successfully`)
        alarmClock.snoozeAlarm(alarm.id,true)
        console.log("cancel")
    }else{
        window.alert(`Snoozing the alarm ${new Date(alarm.time).toLocaleTimeString()} for 5 mins successfully`)
        alarmClock.snoozeAlarm(alarm.id)
        console.log("snooze")
    }
}


setInterval(function(){
    const alarms = alarmClock.getAlarms();
    alarms.forEach((alarm)=>{
        if(isTimeSame(alarm.time,new Date())){
            alarmClock.playAlarm(alarm.id)
            const elem = document.getElementById(alarm.id)
            const para = document.createElement("p")
            para.setAttribute("class", "alarmNotify")
            para.innerText="Alarm Ringing"
            elem.appendChild(para)
            // window.alert(`Alarm ${new Date(alarm.time).toLocaleTimeString()} is Ringing for snooze press "Any Keys abort from "C", for Cancel Press "C" `)
            window.addEventListener("keydown",(e)=>handleSnoozeCancel(e,alarm),{once:true})
        }
    })
},60*1000)

// ...........................................................................
const addAlarmToUI = (timeForAlarm,id) => {
    const day = new Date(timeForAlarm).getDay()
    let Hour = new Date(timeForAlarm).getHours()
    const Min = new Date(timeForAlarm).getMinutes()
    const alarmEle =  document.createElement("div")
    alarmEle.setAttribute("class", "alarmElement")

    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
    const dayName = days[day];
    
    const ampm = Hour >= 12 ? 'PM' : 'AM';
    Hour = Hour % 12;
    Hour = Hour ? Hour : 12;

    alarmEle.innerHTML = `
        <div id="alarm-details">
            <h3 id=${id}>
                ${alarms.childElementCount +1}. ${dayName} ${Hour.toString().padStart(2,"0")}:${Min.toString().padStart(2,"0")} ${ampm}
            </h3>
            <button class="alarmDeleteBtn" onclick="alarmClock.deleteAlarm(${id})">X</button>
        </div>
        <p id="next-alarm">Next Alarm on ${new Date(timeForAlarm).toLocaleString()}</p>
        
    `
    alarms.appendChild(alarmEle)
   
}

// ...............................................................................

