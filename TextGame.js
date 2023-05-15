PlayerData = {}

window.onload = function (){
    item = localStorage.getItem("UserData")
    PlayerData = JSON.parse(item)
    if (PlayerData != null){
        document.getElementById('GameID').value = PlayerData['ID']
        Load()
    }
    else{
        PlayerData = {}
    }
    setInterval(WorkerData,1000)
}
window.onbeforeunload = async function (){
    if (!(Object.keys(PlayerData).length === 0)){
        localStorage.setItem("UserData", JSON.stringify(PlayerData))
        res = await fetch('/UpdateData',{
            method: "POST",
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(PlayerData)
        })
        if (res.status = 200){
            console.log('Save Data')
        }
        else{
            alert('error on database')
        }
    }
}
function switchHome(){
    document.getElementById('Home').style.display = 'block'
    document.getElementById('navHome').style.backgroundColor = 'bisque'
    document.getElementById('navHome').style.fontWeight = 'bold'
    document.getElementById('navHome').className = 'nav-link active'
    document.getElementById('Setting').style.display = 'none'
    document.getElementById('navSetting').style.backgroundColor = null
    document.getElementById('navSetting').style.fontWeight = null
    document.getElementById('navSetting').className = 'nav-link'
    document.getElementById('AboutUs').style.display = 'none'
    document.getElementById('navAboutUs').style.backgroundColor = null
    document.getElementById('navAboutUs').style.fontWeight = null
    document.getElementById('navAboutUs').className = 'nav-link'
}

function switchSetting(){
    document.getElementById('Home').style.display = 'none'
    document.getElementById('navHome').style.backgroundColor = null
    document.getElementById('navHome').style.fontWeight = null
    document.getElementById('navHome').className = 'nav-link'
    document.getElementById('Setting').style.display = 'block'
    document.getElementById('navSetting').style.backgroundColor = 'bisque'
    document.getElementById('navSetting').style.fontWeight = 'bold'
    document.getElementById('navSetting').className = 'nav-link active'
    document.getElementById('AboutUs').style.display = 'none'
    document.getElementById('navAboutUs').style.background = null
    document.getElementById('navAboutUs').style.fontWeight = null
    document.getElementById('navAboutUs').className = 'nav-link'
}

function switchAboutUs(){
    document.getElementById('Home').style.display = 'none'
    document.getElementById('navHome').style.backgroundColor = null
    document.getElementById('navHome').style.fontWeight = null
    document.getElementById('navHome').className = 'nav-link'
    document.getElementById('Setting').style.display = 'none'
    document.getElementById('navSetting').style.backgroundColor = null
    document.getElementById('navSetting').style.fontWeight = null
    document.getElementById('navSetting').className = 'nav-link'
    document.getElementById('AboutUs').style.display = 'block'
    document.getElementById('navAboutUs').style.backgroundColor = 'bisque'
    document.getElementById('navAboutUs').style.fontWeight = 'bold'
    document.getElementById('navAboutUs').className = 'nav-link active'
}
// Create Random User Id Between Length 6-12
function CreateID(){
    IDLen = Math.random() * (12-6) + 6
    ID = ""
    for (i=0;i<IDLen;i++){
        ID += Math.floor(Math.random() * 10)
    }
    console.log(ID)
    return ID
}
async function StartGame(){
    document.getElementById('StartMenu').style.display = 'none'
    document.getElementById('Game').style.display = 'block'
    document.getElementById('navHome').style.backgroundColor = 'bisque'
    document.getElementById('navHome').style.fontWeight = 'bold'
    PlayerData['Gold'] = 0
    PlayerData['Food'] = 0
    PlayerData['Wood'] = 0
    PlayerData['Rock'] = 0
    PlayerData['WorkerAmount'] = 0
    PlayerData['FarmWorker'] = 0
    PlayerData['ForestsWorker'] = 0
    PlayerData['RockMineWorker'] = 0
    while (true){
        PlayerData['ID'] = CreateID();
        res = await fetch('/CheckUserID',{
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(PlayerData)
        })
        console.log(res.status);
        if (res.status == 200){
            document.getElementById('UID').innerHTML = PlayerData['ID']
            break
        }
        else if (res.status == 500){
            window.location.reload()
            break
        }
    }
}
async function Restart(){
    localStorage.removeItem('UserData')
    res = await fetch('/RemoveUID',{
        method: "POST",
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(PlayerData)
    })
    if (res.status == 200){
        PlayerData = {}
    }
    window.location.reload()
}
async function Load(){
    UID = document.getElementById('GameID').value
    res = await fetch('/LoadUID', {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({'ID':UID})
    })
    if (res.status == 200){
        doc = await res.json()
        PlayerData = JSON.parse(JSON.stringify(doc))
        document.getElementById('StartMenu').style.display = 'none'
        document.getElementById('Game').style.display = 'block'
        document.getElementById('navHome').style.backgroundColor = 'bisque'
        document.getElementById('navHome').style.fontWeight = 'bold'
        document.getElementById('UID').innerHTML = PlayerData['ID']
    }
    else {
        alert("Can't Find UID or Error on Database")
        window.location.reload()
    }
}
async function LoadInGame(){
    UID = document.getElementById('GameIDInGame').value
    res = await fetch('/LoadUID', {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({'ID':UID})
    })
    if (res.status == 200){
        doc = await res.json()
        PlayerData = JSON.parse(JSON.stringify(doc))
    }
    else {
        alert("Can't Find UID or Error on Database")
    }
    window.location.reload()
}
function Display(name){
    dp = document.getElementById(name).style.display
    ListButton = [
        'Map',
        'Building',
        'Shop',
        'Warehouse'
    ]
    if (dp == "none"){
        for (i=0;i<ListButton.length;i++){
            if (ListButton[i] == name){
                document.getElementById(name).style.display = 'block'
                if (name == "Warehouse"){
                    Update()
                }
            }
            else{
                document.getElementById(ListButton[i]).style.display = 'none'
            }
        }
    }
    else{
        for (i=0;i<ListButton.length;i++){
            document.getElementById(ListButton[i]).style.display = 'none'
        }
    }
}
function GetResource(name){
    PlayerData[name] += 1
}
function Update(){
    document.getElementById('GoldNum').innerHTML = PlayerData['Gold']
    document.getElementById('FoodNum').innerHTML = PlayerData['Food']
    document.getElementById('WoodNum').innerHTML = PlayerData['Wood']
    document.getElementById('RockNum').innerHTML = PlayerData['Rock']
}
function Exchange(Amount,Sell,Buy){
    if (PlayerData[Sell] >= Amount){
        PlayerData[Sell]-=Amount
        PlayerData[Buy]+=1
    }
    else{
        alert("Not Enough")
    }
}
let First = false
function WorkerData(){
    TotalWorker = PlayerData['WorkerAmount'] + PlayerData['FarmWorker'] + PlayerData['ForestsWorker'] + PlayerData['RockMineWorker']
    if (PlayerData['Food'] >= TotalWorker && TotalWorker != 0){
        PlayerData['Food'] -= TotalWorker
        PlayerData['Food'] += (PlayerData['FarmWorker'] * 2)
        PlayerData['Wood'] += (PlayerData['ForestsWorker']/5)
        PlayerData['Rock'] += (PlayerData['RockMineWorker']/10)
        Update()
        First = true
    }
    else{
        if (First){
            alert("Didn't have Enough Food for Workers, Worker Stop Working")
            First = false
        }
    }
}
function BuyWorker(){
    if (PlayerData['Gold'] >= 100){
        PlayerData['WorkerAmount']+=1
        PlayerData['Gold']-=100
        document.getElementById('WorkerAmount').innerHTML = PlayerData['WorkerAmount']
        alert('Success, Each Worker Require 1 Food Per Second')
    }
    else{
        alert('Not Enough Gold, Require 100 Gold')
    }
}
function RemoveWorker(name){
    if (name == 'Food' && PlayerData['FarmWorker'] >= 1){
        PlayerData['WorkerAmount']+=1
        PlayerData['FarmWorker']-=1
        document.getElementById('FoodWorker').innerHTML = PlayerData['FarmWorker']
        document.getElementById('FoodPers').innerHTML = (PlayerData['FarmWorker'] * 2)
        document.getElementById('WorkerAmount').innerHTML = PlayerData['WorkerAmount']
    }
    else if(name == 'Wood' && PlayerData['ForestsWorker'] >=5){
        PlayerData['WorkerAmount']+=5
        PlayerData['ForestsWorker']-=5
        document.getElementById('WoodWorker').innerHTML = PlayerData['ForestesWorker']
        document.getElementById('WoodPers').innerHTML = (PlayerData['ForestsWorker']/5)
        document.getElementById('WorkerAmount').innerHTML = PlayerData['WorkerAmount']
    }
    else if(name == 'Rock' && PlayerData['RockMineWorker'] >= 10){
        PlayerData['WorkerAmount']+=10
        PlayerData['RockMineWorker']-=10
        document.getElementById('RockMineWorker').innerHTML = PlayerData['RockMineWorker']
        document.getElementById('RockPers').innerHTML = (PlayerData['RockMineWorker']/10)
        document.getElementById('WorkerAmount').innerHTML = PlayerData['WorkerAmount']
    }
    else{
        alert("Didn't have Worker")
    }
}
function AddWorker(name){
    if (name == 'Food' && PlayerData['WorkerAmount'] >= 1){
        PlayerData['WorkerAmount']-=1
        PlayerData['FarmWorker']+=1
        document.getElementById('FoodWorker').innerHTML = PlayerData['FarmWorker']
        document.getElementById('FoodPers').innerHTML = (PlayerData['FarmWorker'] * 2)
        document.getElementById('WorkerAmount').innerHTML = PlayerData['WorkerAmount']
    }
    else if(name == 'Wood' && PlayerData['WorkerAmount'] >=5){
        PlayerData['WorkerAmount']-=5
        PlayerData['ForestsWorker']+=5
        document.getElementById('WoodWorker').innerHTML = PlayerData['ForestesWorker']
        document.getElementById('WoodPers').innerHTML = (PlayerData['ForestsWorker']/5)
        document.getElementById('WorkerAmount').innerHTML = PlayerData['WorkerAmount']
    }
    else if(name == 'Rock' && PlayerData['WorkerAmount'] >= 10){
        PlayerData['WorkerAmount']-=10
        PlayerData['RockMineWorker']+=10
        document.getElementById('RockMineWorker').innerHTML = PlayerData['RockMineWorker']
        document.getElementById('RockPers').innerHTML = (PlayerData['RockMineWorker']/10)
        document.getElementById('WorkerAmount').innerHTML = PlayerData['WorkerAmount']
    }
    else{
        alert('You need to buy worker.\nRequirement: \nFood = 1\nWood = 5\nRock = 10')
    }
}