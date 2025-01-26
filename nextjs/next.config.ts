import type {NextConfig} from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();
const nextConfig: NextConfig = {};
if (process.env.IS_TEST_SERVER) {
    nextConfig.experimental = {};
    nextConfig.experimental.swcPlugins = [["swc-plugin-coverage-instrument", {}]];
    nextConfig.experimental.forceSwcTransforms = true;
}

export default withNextIntl(nextConfig);
