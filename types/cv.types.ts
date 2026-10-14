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

export type SkillType = "soft" | "hard";

export interface Skill{
    id : string;
    name : string;
    type : SkillType;
}

export interface CVData{
    personalInfo : PersonalInfo;
    // uri local de la foto de perfil (cámara o galería)
    photoUri : string | null;
    experience : Experience[];
    education : Education[];
    skills : Skill[];
}
