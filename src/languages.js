import google from '../data/google';
import yandex from '../data/yandex';

export default (name, engine) => {
    switch (engine) {
        case 'google': engine = google; break;
        case 'yandex': engine = yandex; break;
        default: engine = google;
    }
    // Validate the name string
    if (typeof name !== 'string') {
      throw new Error(`The language must be a string, received ${typeof name}`);
    }
    // Possible overflow errors
    if (name.length > 100) {
      throw new Error(`The language must be a string under 100 characters, received ${name.length}`);
    }
    // Let's work with lowercase for everything
    name = name.toLowerCase();

    return map(name, engine);

    function map(name, engine) {
        let code = Object.entries(engine).find(kv => kv[0] === name || kv[1] === name);
        if (!name || !code) { 
            throw new Error(`The name "${name}" is not suppored by the ${engine} translation API.`);
        }
        return code[1];
    }
}
