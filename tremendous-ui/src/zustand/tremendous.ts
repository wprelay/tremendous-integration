import {create} from "zustand";
import {tremendousSettingState} from "./zustand.types";

export const useTremendous = create<tremendousSettingState>((set) => ({
    settingState: {},
    setSettingState: (data) => set({settingState: data})
}));
