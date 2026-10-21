/** Shared method-name recognition for hooks; inline text keeps Source trust checks. */
export function isLogicMethod(handler) {
    return typeof handler === 'string' && !['null', 'true', 'false'].includes(handler) && /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*$/.test(handler);
}

export function callLogic(runtime, node, methodName, context) {
    const {group, method} = runtime.logicRegistry.resolve(methodName, node);
    return method.call(group, node, context);
}

export function invokeHook(runtime, node, attribute, handler, context, inlineNames = Object.keys(context)) {
    if (isLogicMethod(handler)) return callLogic(runtime, node, handler, context);
    return runtime.inlineCompiler.compile(node, attribute, handler, inlineNames)(context);
}
