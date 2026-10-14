//define como se va a lucir los objetos haciendo el desarrollo mas rapido seguro y escalablke

export interface PersonalInfo{
    fullName: string;
    email : string;
    phone : string;
    location : string;
    summary : string;
}

export interface Experience{
    id : string;
    company : string;
    position : string;
    startDate : string;
    endDate : string;
    description : string;
}

export interface Education{
    id : string;
    institution : string;
    degree : string;
    field : string;
    graduationDate : string;
}

export interface CVData{
    personalInfo : PersonalInfo;
    experience : Experience[];
    education : Education[];
}