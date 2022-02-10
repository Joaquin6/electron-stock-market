const robinhood = require('robinhood');

const credentials = {
    username: process.env.USERNAME || '',
    password: process.env.PASSWORD || ''
};

const Robinhood = robinhood(credentials, (data) => {
    if (data && data.mfa_required) {
        const mfa_code = process.env.MFA_CODE;

        Robinhood.set_mfa_code(mfa_code, () => {
            console.log(Robinhood.auth_token());
        });
    } else {
        console.log(Robinhood.auth_token());
    }
})
