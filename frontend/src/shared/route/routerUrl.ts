const SOURCES = '/sources';
const ONE_SOURCES = (id: number | string) => `/sources/${id}`;
const CREATE_SOURCES = '/sources/create';
const EDIT_SOURCES = (id: number | string) => `/sources/${id}/edit`;

const SEGMENTS = '/segments';
const ONE_SEGMENT = (id: number | string) => `/segments/${id}`;
const CREATE_SEGMENT = '/segments/create';
const EDIT_SEGMENTS = (id: number | string) => `/segments/${id}/edit`;

const CAMPAIGNS = '/campaigns';
const ONE_CAMPAIGN = (id: number | string) => `${CAMPAIGNS}/${id}`;
const CREATE_CAMPAIGN = `${CAMPAIGNS}/create`;
const EDIT_CAMPAIGN = (id: number | string) => `${CAMPAIGNS}/${id}/edit`;

const TEMPLATES = '/templates';
const ONE_TEMPLATE = (id: number | string) => `${TEMPLATES}/${id}`;
const CREATE_TEMPLATE = `${TEMPLATES}/create`;
const EDIT_TEMPLATE = (id: number | string) => `${TEMPLATES}/${id}/edit`;

export {
    SOURCES,
    ONE_SOURCES,
    CREATE_SOURCES,
    EDIT_SOURCES,
    SEGMENTS,
    ONE_SEGMENT,
    CREATE_SEGMENT,
    EDIT_SEGMENTS,
    CAMPAIGNS,
    ONE_CAMPAIGN,
    CREATE_CAMPAIGN,
    EDIT_CAMPAIGN,
    TEMPLATES,
    ONE_TEMPLATE,
    CREATE_TEMPLATE,
    EDIT_TEMPLATE,
};
