let patientData = [
    {
        id: "p294817981",
        firstName: "Martina",
        lastName: "Long",
        age: 21,
        address: {
            street: "855 Folsom St, Apt 715",
            city: "San Francisco",
            state: "CA",
            zip: "94107"
        },
        email: "martinalong10@gmail.com",
        password: "password",
        appointments: [
            {
                date: "11/20/2019",
                time: "14:30",
                provider: "d00000001"
            },
            {
                date: "02/03/2020",
                time: "09:00",
                provider: "d29987621"
            }
        ],
        insurance: {
            provider: "Aetna",
            plan: "Choice Plus",
            type: "PPO"
        },
        pharmacy: "m294988101"
    }
]

let providerData = [
    {
        id: "d299876212",
        firstName: "Nicole",
        lastName: "Tsang",
        title: "MD",
        email: "nicoletsang@circlemedical.com",
        password: "password",
        clinic: "c028382253",
        availability: {
            mon: ["09:30", "10:15", "14:30", "15:00"],
            tues: ["10:15", "15:00"],
            weds: ["08:30", "11:15", "14:00"],
            thurs: ["10:15", "12:30", "13:15"]
        }
    }
]

let clinicData = [
    {
        id: "c028382253",
        name: "Circle Medical",
        phone: "4158400560",
        fax: "4152992370",
        email: "info@circlemedical.com",
        preferred: "email",
        address: {
            street: "333 1st Street, #A Entrance",
            city: "San Francisco",
            state: "CA",
            zip: "94105"
        },
        providers: ["d299876212"],
        specialty: "general practice"
    }
]

let pharmacyData = [
    {
        id: "m294988101",
        name: "Alto Pharmacy",
        address: {
            street: "2210 Avalon St",
            city: "San Francisco",
            state: "CA",
            zip: "94105"
        },
        phone: "4153892739",
        fax: "4152942223"
    }
]

export {
    patientData,
    providerData,
    clinicData,
    pharmacyData
  }