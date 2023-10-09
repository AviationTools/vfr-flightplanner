import { Runway } from "./runway";

export interface Airport {
    name: String,
    icao: String,
    elevation: Number,
    variation: Number,
    runwayLength: Number,
    runwayWidth: Number,
    runway: String,
    coordinates: [Number],
    frequency: String,
    runwayInfos: [Runway]
}