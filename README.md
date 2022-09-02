
## NextCMS

NextCMS is an **C**ontent **M**anagement **S**ystem driven by **[Next.js](https://nextjs.org/)**, it has been built from the groud up to serve as a template to build apps with ease that are in need of an administered and interactable website.

> <p align="center">
>   <img width="40%" src="http://cdn.thijmenheuvelink.nl/github-nextcms-assets-login">
>   <img width="34.9%" src="http://cdn.thijmenheuvelink.nl/github-nextcms-assets-users">
> </p>
> [ALT]: NextCMS interface login and users preview.

### Installation

1. Make sure you've installed **[Docker](https://www.docker.com)**.
2. Rename `/.env-template` to `/.env` or make your own `/.env` file.
3. Change the `/.env` file accordingly.
4. Run: `docker build -t nextcms .`
5. Run: `docker run --name NextCMS -p 3000:3000 -d nextcms`
> 6. Generate an admin password: `docker exec NextCMS npx prisma db seed`

_NextCMS is now accessible at http://0.0.0.0:3000._

### Roles
Level | Name | Can Login | Edit Users
-|-|-|-
4 | Administrator | Yes | Yes
3 | Moderator | Yes | Yes
2 | Viewer | Yes | No
1 | Unprivileged | No | No
