import cookie from 'react-cookies';

const cookiesPath = "/";
/*Simple cookies load/save functions using the react-cookies library*/
export function loadPropertyCookie(propertyName) {
	return cookie.load(propertyName);
}

export function savePropertyCookie(propertyName, value) {
	cookie.save(propertyName, value, {path: cookiesPath, expires: new Date(new Date().getTime() +1000*60*60*24*365), sameSite: true});
}