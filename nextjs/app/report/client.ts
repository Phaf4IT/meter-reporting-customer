import {CustomerMeasurement} from "@/components/report/customerMeasurement";
import {reportFromJson} from "@/app/api/report/report";
import {campaignFromJson} from "@/components/report/campaign";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function getReport(token: string) {
    const data = await fetch("/api/report?token=" + token, {
        method: "GET",
        credentials: "include"
    });
    if (!data.ok) {
        return Promise.reject(`Error: ${data.status} ${data.statusText}`)
    }
    const report = await data.json();
    return reportFromJson(report)
}

export async function getCampaignOptions(token: string, router: AppRouterInstance) {
    const response = await fetch("/api/campaign?token=" + token, {
        method: "GET",
        credentials: "include"
    });
    if (response.status == 307) {
        router.push(await response.text());
        return Promise.resolve()
    }
    if (!response.ok) {
        return Promise.reject(`Error: ${response.status} ${response.statusText}`)
    }
    const campaign = await response.json();
    return campaignFromJson(campaign)
}

export async function report(data: CustomerMeasurement, token: string, router: AppRouterInstance) {
    const response = await fetch("/api/report?token=" + token, {
        method: "POST",
        body: JSON.stringify(data),
        credentials: "include"
    });
    if (response.status == 307) {
        router.push(await response.text());
        return Promise.resolve()
    }
    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return Promise.resolve()
}