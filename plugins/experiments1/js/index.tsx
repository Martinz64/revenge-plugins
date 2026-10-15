/**
 * Plugin JS entry point (`dist.script`).
 */

import { } from "@revenge-mod/discord/modules/main_tabs_v2"
import { getModules, lookupModules } from "@revenge-mod/modules/finders"
import { withProps } from "@revenge-mod/modules/finders/filters"
import { hook } from "./wrapRender"
import StatusIcons from './StatusIcons'
import { after, before } from "@revenge-mod/patcher"
import { View } from "react-native"
import PresenceUpdatedContainer from "./PresenceUpdatedContainer"



export function getDiscordFinders(): any {
	return (
		(revenge.discord?.utils as any)?.modules?.finders ??
		(revenge.discord?.utils as any)?.finders ??
		(revenge as any)?.everest
	)
}



/**
 * Resolves a module by its recorded source path in Discord's bundle.
 * Returns the module exports (unwrapping the [exports, id] tuple).
 */
export function findByImportedPath<T = any>(path: string): T | null {
	const finders = getDiscordFinders()
	if (typeof finders?.lookupModuleWithImportedPath === 'function') {
		try {
			const res = finders.lookupModuleWithImportedPath(path)
			if (res && res.length > 0) {
				return (res[0]?.default ?? res[0]) as T
			}
		} catch {}
	}
	return null
}

/**
 * Resolves a module and its numeric ID by its recorded source path.
 * Returns [exports, id] or null if not resolved yet.
 */
export function findTupleByImportedPath<T = any>(path: string): [T, number] | null {
	const finders = getDiscordFinders()
	if (typeof finders?.lookupModuleWithImportedPath === 'function') {
		try {
			const res = finders.lookupModuleWithImportedPath(path)
			if (res && res.length > 0) {
				return [res[0] as T, res[1] as number]
			}
		} catch {}
	}
	return null
}

/**
 * Subscribes to Discord's module loading to resolve a module as soon as it imports.
 * Unsubscribes itself upon resolution, or returns a cancellation callback.
 */
export function waitForImportedPath<T = any>(
	path: string,
	callback: (exports: T, id: number) => void,
): (() => void) | void {
	const finders = getDiscordFinders()
	const fn = finders?.waitForModuleWithImportedPath ?? finders?.getModuleWithImportedPath
	if (typeof fn === 'function') {
		try {
			return fn(path, (exports: any, id: number) => {
				const exp = Array.isArray(exports) ? exports[0] : exports
				callback(exp as T, id)
			})
		} catch {}
	}
}

/**
 * Convenience helper that gets a module either immediately if already loaded,
 * or via callback when loaded.
 */
export function getImportedModule<T = any>(
	path: string,
	onModule: (exports: T, id?: number) => void,
): (() => void) | void {
	const tuple = findTupleByImportedPath<T>(path)
	if (tuple) {
		onModule(tuple[0], tuple[1])
		return
	}
	return waitForImportedPath<T>(path, (exp, id) => onModule(exp, id))
}
const { View, Text } = revenge.react.ReactNative




export default plugin({
	// Runs as soon as possible with heavily limited APIs.
	// You generally don't need to use this unless you need to patch something very early.
	// Even then, try `init()` instead.
	preInit() {},

	// Runs as soon as important modules are initialized with limited APIs.
	// You generally don't need to use this unless you need to patch something early.
	init() {},

	// Runs during the AppRegistry.runApplication call. All APIs are available.
	start({cleanup}) {
		// See `logcat | grep ReactNativeJS` on Android.
		console.log('[plugin] JS started')
		window.finders = getDiscordFinders()
		window.wp = withProps
		window.lm = lookupModules
		//window.nnn = BundleUpdaterManager.reload


		/*function cleanDM(ret:any): any{
			

			try{

				let elementWithRecipients = find(ret, m => m?.props?.recipients)
				let userId = elementWithRecipients?.props?.recipients?.[0]
				

				let found = find(ret, m => m?.props?.children?.some?.(h => h?.props?.ellipsizeMode))
				found.props.children.push(
					<>
					<StatusIcons userId={userId}/>
					</>
				)
			} catch(e){
				console.log("ere",e)
			}
			return ret
		}
		hook(
			'modules/main_tabs_v2/native/tabs/messages/items/channel/MessagesItemChannelContent.tsx',
			'dm channel',
			ret => cleanDM(ret),
		)*/


		function patchUsernameWithEffects(res: any): any{
			window.shdh6696 = res
			const original = res;
			if(res?.props?.style?.__platformindicators_userId){
				const userId = res.props.style.__platformindicators_userId;
				/*return <Design.Stack direction="horizontal">
					{original}
					<StatusIcons userId={userId}/>
				</Design.Stack>*/
				return <View style={{
					display: "flex",
					flexDirection: "row",
					alignContent: "center",
					justifyContent: "flex-start"
				}}>
					{original}
					<PresenceUpdatedContainer>
						<StatusIcons userId={userId}/>
					</PresenceUpdatedContainer>
				</View>
			}
			return res
		}
		hook(
			'modules/display_name_styles/native/UsernameWithEffects.tsx',
			'username',
			false,
			ret => patchUsernameWithEffects(ret),
		)


		function patchUsernameWithEffects2(res: any): any{
			window.shdh6767 = res
			const original = res;
			//return <StatusIcons userId="{original.props.userId}"/>
			/*return <Design.Stack direction="horizontal">
				{original}
				<StatusIcons userId="{original.props.userId}"/>
			</Design.Stack>*/
			//return res
			if(!res) return res;
			if(!res[0]) return res;
			if(!res[0].userId) return res;
			if(!res[0].style) return res;

			const uid = res[0].userId
			res[0].style.__platformindicators_userId = uid
			return res;
		}
		hook(
			'modules/display_name_styles/native/UsernameWithEffects.tsx',
			'username2',
			true,
			ret => patchUsernameWithEffects2(ret),
		)
		
		getModules(withProps('renderChannelTitle'), ChannelRenderings => {
				cleanup(
					/*after(ChannelRenderings, 'renderChannelTitle', res => {
						window.shdh22 = res
						const original = res

						//this is a better solution but i hate dealing with texts
						//might revisit later
						/*res.props.title = <View style={{
							display: "flex",
							flexDirection: "row",
							alignContent: "center",
							justifyContent: "flex-start"
						}}>
							<Text>{original.title}</Text>
							<StatusIcons userId={original.props.userId}/>

						</View>*/
						/*return <View style={{
							display: "flex",
							flexDirection: "row",
							alignContent: "center",
							justifyContent: "flex-start"
						}}>
							{original}
							<StatusIcons userId={original.props.userId}/>
						</View>*//*
						return res;
			
					}),*/

					before(ChannelRenderings, 'renderChannelTitle', args => {
						window.shdh223 = args
						const original = args

						//this is a better solution but i hate dealing with texts
						//might revisit later
						/*res.props.title = <View style={{
							display: "flex",
							flexDirection: "row",
							alignContent: "center",
							justifyContent: "flex-start"
						}}>
							<Text>{original.title}</Text>
							<StatusIcons userId={original.props.userId}/>

						</View>*/
						/*return <View style={{
							display: "flex",
							flexDirection: "row",
							alignContent: "center",
							justifyContent: "flex-start"
						}}>
							{original}
							<StatusIcons userId={original.props.userId}/>
						</View>*/
						return args;
			
					})
				)
		})


		/*getModules(withProps('Icon'), IconHolder => {
				cleanup(
					after(IconHolder, 'Icon', res => {
						window.shdh23 = res
						//const original = res.props.children
						//return <StatusIcons userId="{original.props.userId}"/>
						return <View style={{
							width:16,
							height: 16,
							backgroundColor: "#ff0000"
						}}></View>
					})
				)
		})*/

		/*getModules(withProps('renderTitleWrapper'), ChannelRenderings => {
				cleanup(
					after(ChannelRenderings, 'renderTitleWrapper', res => {
						window.shdh23 = res
						const original = res.props.children

						//this is a better solution but i hate dealing with texts
						//might revisit later
						/*res.props.title = <View style={{
							display: "flex",
							flexDirection: "row",
							alignContent: "center",
							justifyContent: "flex-start"
						}}>
							<Text>{original.title}</Text>
							<StatusIcons userId={original.props.userId}/>

						</View>*/
						/*return <View style={{
							display: "flex",
							flexDirection: "row",
							alignContent: "center",
							justifyContent: "flex-start"
						}}>
							{original}
							<StatusIcons userId="{original.props.userId}"/>
						</View>*//*

						res.props.children = <View style={{
							display: "flex",
							flexDirection: "row",
							alignContent: "center",
							justifyContent: "flex-start"
						}}>
							{original}
							<StatusIcons userId="{original.props.userId}"/>
						</View>
						return res;
			
					}),
				)
		})*/

		getModules(withProps('DisplayName'), ChannelRenderings => {
				cleanup(
					after(ChannelRenderings, 'DisplayName', res => {
						window.shdh67 = res
						const original = res

						/*res.props.title = <View>
							<text>{original.title}</text>
							<StatusIcons userId={original.props.userId}/>

						</View>*/
						/*return <View>
							{original}
							<StatusIcons userId={userId}/>
						</View>*/
						return res;
			
					}),
				)
		})


		/*cleanup(
			getModules(withProps('Fragment'), FragmentHolder => {
				cleanup(
					after(FragmentHolder, 'Fragment', res => {
						window.res2 = res
						return res;
			
					}),
				)
			}),
		)*/

		/*function doThing1(mod:any){


			console.log(mod)
			window.mmm = mod

			revenge.patcher.after(mod.MessagesItemChannelFast,"type", (res: any) =>modifyDMChannelItem(res))
			revenge.patcher.after(mod.MessagesItemChannelFlash,"type", (res: any) =>modifyDMChannelItem(res))
			revenge.patcher.after(mod.MessagesItemChannelLegend,"type", (res: any) =>modifyDMChannelItem(res))

		}
		getModuleWithImportedPath("modules/main_tabs_v2/native/tabs/messages/items/MessagesItemChannel.tsx",(mod: any)=>{
			doThing1(mod)
		})*/

		function modifyGuildTag(res:any){
			window.gt = res;
			console.log("gt", res)
			return res;
		}

		function doThingGuildTag(mod: any){
			revenge.patcher.after(mod,"default", (res: any) =>modifyGuildTag(res))
		}

		/*getModuleWithImportedPath("modules/guild_tag/native/GuildTag.tsx",(mod: any)=>{
			doThingGuildTag(mod)
		})*/
		
		/*const mod1 = findByImportedPath('modules/main_tabs_v2/native/tabs/messages/items/channel/MessagesItemChannelBase.tsx')
		if(mod1) doThingsToDMItem(mod1)
		const unsub = waitForImportedPath(
			'modules/main_tabs_v2/native/tabs/messages/items/channel/MessagesItemChannelBase.tsx',
			m=>{
				if(m) doThingsToDMItem(m)
			}
		)
		//if(unsub) cleanups.push(unsub)*/
		
		window.rev = revenge

		
	},



	

	stop() {
		console.log('[plugin] JS stopped')
	},
})


function doThingsToDMItem(mod:any){

	window.sn2 = mod

		//revenge.patcher.after(mod,"default", (res: any) =>{
		//	window.sss = res
		//})



}