import {Physiotherapist} from "../../security/model/physiotherapist";
import {Patient} from "../../security/model/patient";

export interface Consultation {
  id: number;
  done: boolean;
  topic: string;
  diagnosis: string;
  date:string;
  hour:string;
  place:string;
  physiotherapistId: Physiotherapist;
  patientId: Patient;
}
