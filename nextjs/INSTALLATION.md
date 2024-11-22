# Installation
This is a history of all commands before reaching this repository setup...

## Base
Initiate nextjs vercel project:
```bash
vercel init nextjs
```

Go to directory & install latest next (should be already provided)
```bash
cd nextjs & npm i next
```

## Authjs
Install authjs for next
```bash
npm install next-auth@beta
```

Initiate a local secret
```bash
npx auth secret
```

Install Xata (database provider) cli
```bash
npm install --location=global @xata.io/cli
```

Install Xata (database provider)
```bash
npm install @auth/xata-adapter
```

Init auth schema for Xata
```bash
xata init --schema=./xata/auth-schema.json
```



## Middleware
Install functions
```bash
npm i @vercel/functions
```
