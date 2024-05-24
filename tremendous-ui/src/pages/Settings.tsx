import React, {useEffect, useState} from "react";
import {Card, CardContent} from "../components/ui/card";
import {Button} from "../components/ui/button";
import {ClipLoader} from "react-spinners";
import {useLocalState} from "../zustand/localState";
import {axiosClient} from "../components/axios";
import {toastrError, toastrSuccess} from "../ToastHelper";
import {UNPROCESSABLE} from "../data/StatusCodes";
import {settingsType} from "../components/types/settingsType";
import {Input} from "../components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../components/ui/select";
import {handleFields} from "../components/helpers/utils";
import {Switch} from "../components/ui/switch";
import GoBackButton from "../components/General/GoBackButton";

const override = {
    display: "block",
    margin: "auto auto",
    color: `hsl(var(--primary))`,
};

const Settings = () => {
    const [loading, setLoading] = useState(false);
    const [saveChangesLoading, setSaveChangesLoading] = useState(false)
    const [dropDownLoading, setDropDownLoading] = useState(false)
    const {localState} = useLocalState()
    const [errors, setErrors] = useState<any>()
    const [urlCopied, setUrlCopied] = useState<boolean>(false)
    const [campaigns, setCampaigns] = useState<any>([])
    const [fundingSources, setFundingSources] = useState<any>([])

    const [settings, setSettings] = useState<settingsType>({
        sandbox_mode: true,
        api_key: '',
        campaign_id: '',
        funding_source: '',
    });

    const verifyApiKey = (api_key:string) => {
        if(!api_key) {
            toastrError('Api Key is Required');
            return;
        }
        setDropDownLoading(true)
        axiosClient.post(`?action=${localState.ajax_name}`, {
            method: 'verify_tremendous_api_key',
            api_key: api_key,
            _wp_nonce_key: 'wpr_tremendous_nonce',
            _wp_nonce: localState?.nonces?.wpr_tremendous_nonce,
        }).then((response) => {
            let data = response.data.data;
            setCampaigns(data.campaigns);
            setFundingSources(data.funding_sources);
            toastrSuccess("API Key Verified");

            setErrors(null)
        }).catch((error) => {

            let statusCode = error.response.status;

            if (statusCode == 401) {
                let errors = error.response.data.data;
                setErrors(errors)
                toastrError('API Key Verification Failed. Please Check the Key');
                return;
            }

            toastrError("Server Error Occurred While Verifying Tremendous API Key");
        }).finally(() => {
            setDropDownLoading(false)
        })
    }

    const saveSettings = (e: any) => {
        e.preventDefault();
        setSaveChangesLoading(true)

        axiosClient.post(`?action=${localState.ajax_name}`, {
            method: 'save_tremendous_settings',
            _wp_nonce_key: 'wpr_tremendous_nonce',
            _wp_nonce: localState?.nonces?.wpr_tremendous_nonce,
            ...settings
        }).then((response) => {
            toastrSuccess("Tremendous Settings Saved Successfully");
            setErrors(null)
        }).catch((error) => {
            let statusCode = error.response.status;

            if (statusCode == UNPROCESSABLE) {
                let errors = error.response.data.data;
                setErrors(errors)
                toastrError('Validation Failed');
                return;
            }
        }).finally(() => {
            setSaveChangesLoading(false)
        })
    }

    const fetchSettings = () => {
        setLoading(true)
        let queryParams: any = {
            action: localState.ajax_name,
            method: 'get_tremendous_settings',
            _wp_nonce_key: 'wpr_tremendous_nonce',
            _wp_nonce: localState?.nonces?.wpr_tremendous_nonce,
        };

        const query = '?' + new URLSearchParams(queryParams).toString();

        axiosClient.get(`${query}`).then((response) => {
            let data = response?.data?.data
            setSettings(data)

            if (data.api_key) {
                verifyApiKey(data.api_key);
            }
        }).catch((error) => {
            toastrError('Error Occurred While Fetching Tremendous Settings');
        }).finally(() => {
            setLoading(false);
        })
    }

    useEffect(() => {
        fetchSettings();
    }, []);

    const disableVerifyButton = () => {
        return dropDownLoading || !settings.api_key
    }

    return <div className='wrt-py-2'>
        <div className='wrt-flex wrt-justify-between wrt-gap-3 wrt-items-center wrt-m-4'>
            <div>
                <span className='wrt-text-xl wrt-leading-5 wrt-font-bold'>Settings</span>
                <i className='wrt wrt-video wrt-text-xl  wrt-text-grayprimary'></i>
            </div>
            <div className="wrt-flex wrt-gap-2">
                <div>
                    <GoBackButton/>
                </div>
                <div>
                    <Button
                        onClick={saveSettings}
                    >
                        {saveChangesLoading && (
                            <span className="wrt-mx-2"><ClipLoader color="white" cssOverride={override}
                                                                   size={"20px"}/></span>)}
                        <span>Save Changes</span>
                    </Button>
                </div>
            </div>

        </div>

        <Card className='wrt-my-5'>
            <CardContent className='!wrt-p-0'>
                {loading ? (
                    <div className="wrt-w-full wrt-h-96 wrt-flex wrt-flex-row wrt-justify-center wrt-items-center">
                        <div
                        >
                            <ClipLoader cssOverride={override}/>
                        </div>
                    </div>
                ) : (
                    <div className="wrt-w-full wrt-flex wrt-flex-col">
                        <div
                            className="wrt-flex wrt-flex-row wrt-py-10 wrt-border-b-1 wrt-rounded wrt-px-6 wrt-gap-5">
                            <div className="wrt-flex-1 wrt-flex wrt-flex-col wrt-gap-2">
                                <h3 className='wrt-text-4 wrt-font-bold wrt-leading-5'>Sandbox Mode</h3>
                                <p className='wrt-text-sm wrt-text-grayprimary'>Enable if you want test in Sandbox
                                    environment</p>
                            </div>
                            <div className="wrt-flex-1 wrt-flex-row wrt-gap-1">
                                <div className='wrt-flex wrt-flex-col wrt-justify-start wrt-gap-2 wrt-w-full'>
                                    <div className="wrt-flex wrt-justify-start wrt-gap-0 wrt-w-full">
                                        <Switch onCheckedChange={(value: any) => {
                                            setSettings({
                                                ...settings,
                                                sandbox_mode: value,
                                            })
                                        }} checked={settings.sandbox_mode}>
                                        </Switch>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="wrt-w-full wrt-flex wrt-flex-col">
                            <div
                                className="wrt-flex wrt-flex-row wrt-py-10 wrt-border-b-1 wrt-rounded wrt-px-6 wrt-gap-5">
                                <div className="wrt-flex-1 wrt-flex wrt-flex-col wrt-gap-2">
                                    <h3 className='wrt-text-4 wrt-font-bold wrt-leading-5'>API KEY</h3>
                                </div>
                                <div className="wrt-flex-1 wrt-flex-row wrt-gap-1">
                                    <div
                                        className='wrt-flex wrt-flex-col wrt-justify-start wrt-gap-2 wrt-w-full'>
                                        <div className="wrt-flex wrt-justify-between wrt-gap-2 wrt-w-full">
                                            <Input
                                                type="text"
                                                className='wrt-w-80% wrt-text-primary focus:!wrt-border-none focus:!wrt-shadow-none'
                                                defaultValue={settings.api_key}
                                                placeholder="API KEY"
                                                onChange={(e: any) => {
                                                    setSettings(handleFields(settings, e.target.value, 'api_key'));
                                                }}
                                            />
                                            <button
                                                className={`wrt-inline-flex wrt-items-center wrt-justify-center wrt-whitespace-nowrap wrt-rounded-md wrt-text-sm wrt-font-medium wrt-transition-colors wrt-focus-visible:outline-none wrt-focus-visible:ring-1 wrt-focus-visible:ring-ring wrt-disabled:pointer-events-none wrt-disabled:opacity-50 wrt-bg-primary wrt-text-primary-foreground wrt-shadow wrt-hover:bg-primary/90 wrt-h-9 wrt-px-4 wrt-py-2  ${disableVerifyButton() ? 'wrt-opacity-70' : 'wrt-cursor-pointer'}`}
                                                onClick={() => {
                                                    verifyApiKey(settings.api_key)
                                                }}
                                                disabled={disableVerifyButton()}
                                            >
                                                Verify
                                                {dropDownLoading && (
                                                    <span className="wrt-mx-2"><ClipLoader color={"white"}
                                                                                           cssOverride={override}
                                                                                           size={"20px"}/></span>)}
                                            </button>
                                        </div>
                                    </div>
                                    <p className=" wrt-text-xs wrt-text-destructive wrt-pt-1.5">{errors?.client_id ? errors.client_id[0] : ''}</p>
                                </div>
                            </div>
                        </div>
                        <div className="wrt-w-full wrt-flex wrt-flex-col">
                            <div
                                className="wrt-flex wrt-flex-row wrt-py-10 wrt-border-b-1 wrt-rounded wrt-px-6 wrt-gap-5">
                                <div className="wrt-flex-1 wrt-flex wrt-flex-col wrt-gap-2">
                                    <h3 className='wrt-text-4 wrt-font-bold wrt-leading-5'>Select Campaign</h3>
                                </div>
                                <div className="wrt-flex-1 wrt-flex-row wrt-gap-1">
                                    <div
                                        className='wrt-flex wrt-flex-row wrt-items-center wrt-gap-2 wrt-w-full'>
                                        <Select onValueChange={(option: any) => {
                                            setSettings(handleFields(settings, option, 'campaign_id'))
                                        }} defaultValue={settings.campaign_id}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Campaign"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {campaigns.map((item: any) => {
                                                    return (
                                                        <SelectItem value={item.value}
                                                                    key={item.value}>{item.label}</SelectItem>
                                                    )
                                                })}
                                            </SelectContent>
                                        </Select>
                                        {dropDownLoading && (
                                            <span className="wrt-mx-2"><ClipLoader cssOverride={override}
                                                                                   size={"20px"}/></span>)}
                                    </div>
                                    <p className=" wrt-text-xs wrt-text-destructive wrt-pt-1.5">{errors?.client_secret ? errors.client_secret[0] : ''}</p>
                                </div>
                            </div>
                        </div>


                        <div className="wrt-w-full wrt-flex wrt-flex-col">
                            <div
                                className="wrt-flex wrt-flex-row wrt-py-10 wrt-border-b-1 wrt-rounded wrt-px-6 wrt-gap-5">
                                <div className="wrt-flex-1 wrt-flex wrt-flex-col wrt-gap-2">
                                    <h3 className='wrt-text-4 wrt-font-bold wrt-leading-5'>Funding Source</h3>
                                </div>
                                <div className="wrt-flex-1 wrt-flex-row wrt-gap-1">
                                    <div
                                        className='wrt-flex wrt-flex-row wrt-justify-start wrt-items-center wrt-gap-2 wrt-w-full'>
                                        <Select onValueChange={(option: any) => {
                                            setSettings(handleFields(settings, option, 'funding_source'))
                                        }} defaultValue={settings.funding_source}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Funding Source"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {fundingSources.map((item: any) => {
                                                    return (
                                                        <SelectItem value={item.value}
                                                                    key={item.value}>{item.label}</SelectItem>
                                                    )
                                                })}
                                            </SelectContent>
                                        </Select>
                                        {dropDownLoading && (
                                            <span className="wrt-mx-2"><ClipLoader cssOverride={override}
                                                                                   size={"20px"}/></span>)}
                                    </div>
                                    <p className=" wrt-text-xs wrt-text-destructive wrt-pt-1.5">{errors?.client_secret ? errors.client_secret[0] : ''}</p>
                                </div>
                            </div>
                        </div>

                    </div>

                )
                }
            </CardContent>
        </Card>
    </div>
}

export default Settings;