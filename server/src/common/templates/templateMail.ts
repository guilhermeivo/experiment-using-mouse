export const templateMail = (
    subject: string, 
    username: string,
    body: string, 
    description: string,
    urlAction: string,
    action: string) => {
        return (`
<!doctype html>
<html>
<head>
    <meta name="viewport" content="width=device-width"/>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>${subject}</title>
    <style>
    body,table td{
        font-size:14px
    }
    .body,body{
        background-color:#f6f6f6
    }
    .container,.content{
        display:block;
        max-width:580px;
        padding:10px
    }
    body,h1,h2,h3,h4{
        line-height:1.4;
        font-family:sans-serif
    }
    body,h1,h2,h3,h4,ol,p,table td,ul{
        font-family:sans-serif
    }
    .btn table td,.footer,h1{
        text-align:center
    }
    .btn a,.btn table td{
        background-color:#fff
    }
    .btn,.btn a,.content,.wrapper{
        box-sizing:border-box
    }
    .btn a,h1{
        text-transform:capitalize
    }
    img{
        border:none;
        -ms-interpolation-mode:bicubic;
        max-width:100%
    }
    body{
        -webkit-font-smoothing:antialiased;
        margin:0;
        padding:0;
        -ms-text-size-adjust:100%;
        -webkit-text-size-adjust:100%
    }
    table{
        border-collapse:separate;
        width:100%
    }
    table td{
        vertical-align:top
    }
    .body{
        width:100%
    }
    .container{
        margin:0 auto!important;
        width:580px
    }
    .btn,.footer,.main{
        width:100%
    }
    .content{
        margin:0 auto
    }
    .main{
        background:#fff;
        border-radius:3px
    }
    .wrapper{
        padding:20px
    }
    .content-block{
        padding-bottom:10px;
        padding-top:10px
    }
    .footer{
        clear:both;
        margin-top:10px
    }
    .footer a,.footer p,.footer span,.footer td{
        color:#999;
        font-size:12px;
        text-align:center
    }
    h1,h2,h3,h4{
        color:#1c1c1c;
        font-weight:400;
        margin:0 0 30px
    }
    .btn a,button,input[type="button"]{
        color:#7a09fa
    }
    h1{
        font-size:35px;
        font-weight:300
    }
    .btn a,ol,p,ul{
        font-size:14px
    }
    ol,p,ul{
        font-weight:400;
        margin:0 0 15px
    }
    ol li,p li,ul li{
        list-style-position:inside;
        margin-left:5px
    }
    a{
        text-decoration:underline
    }
    .btn>tbody>tr>td{
        padding-bottom:15px
    }
    .btn table{
        width:auto
    }
    .btn table td{
        border-radius:5px
    }
    .btn a, .btn button, .btn input[type="button"]{
        border:1px solid #7a09fa;
        border-radius:5px;
        cursor:pointer;
        display:inline-block;
        font-weight:700;
        margin:0;
        padding:12px 25px;
        text-decoration:none
    }
    .btn-primary a,.btn-primary table td{
        background-color:#7a09fa
    }
    .btn-primary a, .btn-primary button, .btn-primary input[type="button"]{
        border-color:#7a09fa;
        color:#fff
    }
    @media only screen and (max-width:620px){
        table[class=body] h1{
            font-size:28px!important;
            margin-bottom:10px!important
        }
        table[class=body] a,table[class=body] button,table[class=body] ol,table[class=body] p,table[class=body] span,table[class=body] td,table[class=body] ul{
            font-size:16px!important
        }
        table[class=body] .article,table[class=body] .wrapper{
            padding:10px!important
        }
        table[class=body] .content{
            padding:0!important
        }
        table[class=body] .container{
            padding:0!important;
            width:100%!important
        }
        table[class=body] .main{
            border-left-width:0!important;
            border-radius:0!important;
            border-right-width:0!important
        }
        table[class=body] .btn button,table[class=body] .btn table{
            width:100%!important
        }
        table[class=body] .img-responsive{
            height:auto!important;
            max-width:100%!important;
            width:auto!important
        }
    }
    @media all{
        .btn-primary input[type="button"]:hover,.btn-primary a:hover,.btn-primary button:hover,.btn-primary table td:hover{
            background-color:#caa2f8!important
        }
        .ExternalClass{
            width:100%
        }
        .ExternalClass,.ExternalClass div,.ExternalClass font,.ExternalClass p,.ExternalClass span,.ExternalClass td{
            line-height:100%
        }
        .apple-link button{
            color:inherit!important;
            font-family:inherit!important;
            font-size:inherit!important;
            font-weight:inherit!important;
            line-height:inherit!important;
            text-decoration:none!important
        }
        #MessageViewBody button{
            color:inherit;
            text-decoration:none;
            font-size:inherit;
            font-family:inherit;
            font-weight:inherit;
            line-height:inherit
        }
        .btn-primary button:hover{
            border-color:#caa2f8!important
        }
        .center{
            margin:0 auto;
            display:block
        }
    }    
    </style>
</head>
<body>
<table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
    <tr>
        <td>&nbsp;</td>
        <td class="container">
            <div class="content">
                <table role="presentation" class="main">
                    <tr>
                    <td class="wrapper">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                            <tr>
                                <td>
                                <p>Hi ${username}✌,</p>
                                <p>${body}</p>
                                ${
                                    (action.length > 0)
                                    ? (() => {
                                        return (`
                                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
                                            <tbody>
                                                <tr>
                                                    <td align="left">
                                                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    <a target="_blank" href="${ urlAction }">${ action }</a>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        `)
                                    })()
                                    : ''
                                }
                                <p>${description}</p>
                                <p>Thank you.</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                    </tr>
                </table>
                <div class="footer">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                        <td class="content-block"> <span class="apple-link">Copyrights ©${new Date().getFullYear()} Experiment Usign Mouse</span> </td>
                    </tr>
                    </table>
                </div>
            </div>
        </td>
        <td>&nbsp;</td>
    </tr>
</table>
</body>
</html>
`)
}