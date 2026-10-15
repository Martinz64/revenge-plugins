
import { Tokens } from "@revenge-mod/discord/common/tokens";
//import { ReactNative, chroma } from "@vendetta/metro/common";
//import { rawColors } from "@vendetta/ui";


/*const { colors, meta } = findByProps("colors", "meta");
const ThemeStore = findByStoreName("ThemeStore");

const color = meta.resolveSemanticColor(ThemeStore.theme, colors.STATUS_ONLINE)*/




export function convertHexColorToInt(color: string){
    return parseInt(color.replace("#","0x"))
}

export function getStatusColor(status: string, useFallback: boolean = false) {
    const Colors: Record<string,string> = {
        online: Tokens.RawColor.GREEN_360,
        dnd: Tokens.RawColor.RED_400,
        idle: Tokens.RawColor.YELLOW_300,
        offline: Tokens.RawColor.PRIMARY_400
    };

    const FallbackColors: Record<string,string> = { 
        online: '#23a55a',
        dnd: '#f23f43',
        idle: '#f0b232',
        offline: '#80848e'
    }

    if(useFallback){
        return FallbackColors[status]
    }
    return Colors[status]
}