import cookie from 'react-cookies';

const cookiesPath = "/";

/*Modified to use 0/1 values instead of true or false to reduce size inside cookies, since I'm pretty sure
they save everything as a string? I could be wrong*/

export function loadPropertyCookie(propertyName) {
	return cookie.load(propertyName);
}

export function savePropertyCookie(propertyName, value) {
	cookie.save(propertyName, value, {path: cookiesPath, expires: new Date(new Date().getTime() +1000*60*60*24*365), sameSite: true});
}