import { writable, type Writable } from "svelte/store";

export const cameraId: Writable<string> = writable("");