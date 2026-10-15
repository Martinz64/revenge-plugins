/**
 * Plugin JS entry point (`dist.script`).
 */

import { } from "@revenge-mod/discord/modules/main_tabs_v2"
import { hook } from "./wrapRender"
import StatusIcons from './StatusIcons'
import PresenceUpdatedContainer from "./PresenceUpdatedContainer"



// CREDITS:
// hook() function from here:
// https://github.com/bleelblep/revenge-next-plugins/blob/main/plugins/hide-call-buttons/js/patches/callButtons.ts



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

		function patchUsernameWithEffects(res: any): any{
			const original = res;
			if(res?.props?.style?.__platformindicators_userId){
				const userId = res.props.style.__platformindicators_userId;
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
			//window.shdh6767 = res
			const original = res;
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
	},

	stop() {
		console.log('[plugin] JS stopped')
	},
})