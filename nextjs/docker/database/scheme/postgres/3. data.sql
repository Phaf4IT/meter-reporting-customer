INSERT INTO users (id,
                   name,
                   email,
                   "emailVerified",
                   image,
                   role,
                   company)
VALUES (1,
        'raf_admin',
        'raffeltjuh@gmail.com',
        now(),
        null,
        'admin',
        'companyX')
ON CONFLICT DO NOTHING
;