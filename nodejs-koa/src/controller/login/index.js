const {suc,failure } = require('../../utils/res')
const {createToken, createRefreshToken} = require('../../service/token')
const { userValid , adminValid} = require('../../service/userValid')

async function loginCtl(ctx){
    let user = { 
        username: ctx.request.body.username,
        pass: ctx.request.body.pass
    }
    let valid = await userValid(user);
        if(valid){
            const token = createToken(ctx.request.body.username,ctx.request.body.pass);
            const refresh_token = createRefreshToken(ctx.request.body.pass);
            ctx.body = suc({token, refresh_token});
        }else{
            ctx.body = failure('请求失败', 'lll');
        }
}

async function adminLoginCtl(ctx){
    let user = { 
        username: ctx.request.body.username,
        pass: ctx.request.body.pass
    }
    let valid = await adminValid(user);
        if(valid){
            const token = createToken(ctx.request.body.username,ctx.request.body.pass);
            const refresh_token = createRefreshToken(ctx.request.body.pass);
            ctx.body = suc({token, refresh_token});
        }else{
            ctx.body = failure('请求失败','lll');
        }
}

module.exports = {
    loginCtl,
    adminLoginCtl,
}