
//taken from https://github.com/bleelblep/revenge-next-plugins/blob/main/plugins/char-counter/js/lib/wrapRender.ts
/**
 * Replaces `render` on a `memo(forwardRef(render))` component found by its module path, with a
 * plain function (not a patcher `instead`: two `instead` hooks on one method recurse, upstream
 * bug). Installed when the module loads, or at once if it has. The undo only puts Discord's back
 * if nobody has wrapped ours since.
 */

import { after, before } from "@revenge-mod/patcher"


const patches: Array<() => void> = []
export const hook = (path: string, label: string, beforePatch: boolean = false, apply: Apply) => {
		patches.push(
			revenge.discord.utils.modules.finders.getModuleWithImportedPath(
				path,
				(ns: any) => {
					const target = ns?.default
					const memo =
						target !== null &&
						typeof target === 'object' &&
						typeof target.type === 'function'
					const owner = memo ? target : ns
					const key = memo ? 'type' : 'default'
					if (typeof owner?.[key] !== 'function')
						return console.warn(`[HideCallButtons] ${label}: nothing to patch`)
					console.log(`[HideCallButtons] ${label}: patched`)
					let logged = false

					let func = (ret: any) => {
							try {
								const out = apply(ret)
								if (!logged) {
									logged = true
									console.log(
										`[HideCallButtons] ${label}: ${out === ret ? 'unchanged' : 'changed'}`,
									)
								}
								return out
							} catch (error) {
								console.error(`[HideCallButtons] ${label}:`, error)
								return ret
							}
						}
					patches.push(
						beforePatch ? before(owner, key, func) : after(owner, key, func)
				    )
				},
			),
		)
	}


//https://github.com/bleelblep/revenge-next-plugins/blob/main/plugins/char-counter/js/lib/badge.tsx#L160
export function find(root: any, predicate: (node: any) => boolean, depth = 0): any {
    //console.log("child",root)
	if (!root || typeof root !== 'object' || depth > 25) return undefined
	if (!Array.isArray(root) && predicate(root)) return root
	const children = Array.isArray(root) ? root : root.props?.children
	if (Array.isArray(children)) {
		for (const child of children) {
			const found = find(child, predicate, depth + 1)
			if (found) return found
		}
	} else if (children && typeof children === 'object') {
		return find(children, predicate, depth + 1)
	}
	return undefined
}

export function wrapRender(
	path: string,
	status: { hooked: boolean; moduleId: number; lastError: string },
	make: (original: (props: any, ref: any) => any) => (props: any, ref: any) => any,
): () => void {
	let host: any
	let original: ((props: any, ref: any) => any) | undefined
	let wrapper: ((props: any, ref: any) => any) | undefined

	const install = (exports: any, id: number) => {
		// Step through memo's `type` to the forwardRef object that holds `render`.
		let target = exports?.default ?? exports
		for (let i = 0; i < 3 && target && typeof target.render !== 'function'; i++) target = target.type
		if (typeof target?.render !== 'function') {
			status.lastError = `module ${id} has no render`
			return
		}
		host = target
		original = target.render
		wrapper = make(original as (props: any, ref: any) => any)
		host.render = wrapper
		status.hooked = true
		status.moduleId = id
	}

	let unsubscribe: (() => void) | undefined
	try {
		unsubscribe = revenge.discord.utils.modules.finders.getModuleWithImportedPath(path, (exports: any, id: any) => {
			try {
				install(exports, id)
			} catch (error) {
				status.lastError = `install: ${(error as Error)?.message ?? error}`
			}
		})
	} catch (error) {
		status.lastError = `lookup: ${(error as Error)?.message ?? error}`
	}

	return () => {
		unsubscribe?.()
		if (host && wrapper && host.render === wrapper) host.render = original
		status.hooked = false
	}
}