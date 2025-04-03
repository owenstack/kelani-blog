/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL,
	generateRobotsTxt: true,
};
