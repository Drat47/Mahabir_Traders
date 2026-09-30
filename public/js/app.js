/* =========================================================================
   MECHANIC LOYALTY & AUDIT SYSTEM - CLIENT APPLICATION LOGIC (SPA)
   ========================================================================= */

const API = {
  get: (url) => apiFetch(url, { method: 'GET' }),
  post: (url, data) => apiFetch(url, { method: 'POST', body: JSON.stringify(data) }),
  patch: (url, data) => apiFetch(url, { method: 'PATCH', body: JSON.stringify(data) })
};

let AppState = {
  token: localStorage.getItem('mech_audit_token') || null,
  user: null,
  lang: localStorage.getItem('mahabir_app_lang') || 'en',
  view: 'dash',
  subViewId: null,
  stats: {},
  mechanics: [],
  purchases: [],
  products: [],
  rewards: [],
  redemptions: [],
  returns: [],
  auditLogs: [],
  notifications: [],
  networkInfo: null,
  pollTimer: null,
  selectedFilter: 'ALL',
  searchQuery: ''
};

/* =========================================================================
   INTERNATIONALIZATION (i18n) - ENGLISH & HINDI DICTIONARIES
   ========================================================================= */

const I18N = {
  en: {
    brand_name: 'Mahabir Traders',
    brand_tagline: 'Mechanic Loyalty, Rewards & Field Audit System',
    lang_name: 'English',
    switch_to_lang: 'हिन्दी में देखें',
    language_selector: 'Language / भाषा',
    loading: 'Loading data...',
    save: 'Save Changes',
    cancel: 'Cancel',
    submit: 'Submit',
    search: 'Search...',
    all: 'ALL',
    view: 'View',
    actions: 'Actions',
    status: 'Status',
    date: 'Date',
    phone: 'Phone Number',
    address: 'Address / Location',
    customer: 'Customer',
    amount: 'Amount',
    points: 'Points',
    total: 'Total',
    items: 'Items',
    logout: 'Logout',
    version: 'Version',
    active: 'Active',
    inactive: 'Inactive',
    approved: 'Approved',
    pending: 'Pending',
    rejected: 'Rejected',
    close: 'Close',
    back: 'Back',
    details: 'Details',
    profile: 'Profile',
    call_worker: 'Call Worker',
    whatsapp: 'WhatsApp',
    edit: 'Edit',
    delete: 'Delete',
    reset_pw: 'Reset Password',
    activate: 'Activate',
    deactivate: 'Deactivate',
    refresh: 'Refresh',

    // User Roles
    role_admin: 'Admin',
    role_auditor: 'Auditor',
    role_mechanic: 'Worker',

    // Navigation
    nav_dashboard: 'Dashboard Overview',
    nav_about_store: 'About Mahabir Traders',
    nav_bill_audits: 'Bill Audits Queue',
    nav_mechanics: 'Mechanics Directory',
    nav_purchases: 'Purchases & Bills',
    nav_returns: 'Returns & Reversals',
    nav_rewards: 'Rewards Catalog',
    nav_redemptions: 'Redemptions',
    nav_reports: 'Reports & Leaderboard',
    nav_audit_logs: 'Audit Trail Logs',
    nav_notifications: 'Notifications',
    nav_settings: 'Settings',
    nav_field_overview: 'Field Overview',
    nav_snap_bill: 'Snap & Log Bill',
    nav_my_dashboard: 'My Dashboard',
    nav_my_purchases: 'My Purchase Records',
    nav_rewards_claim: 'Rewards & Claim',
    nav_redemption_history: 'Redemption History',

    // Mobile Bottom Nav
    bottom_dash: 'Dash',
    bottom_audits: 'Audits',
    bottom_snap: 'Snap',
    bottom_returns: 'Returns',
    bottom_home: 'Home',
    bottom_bills: 'Bills',
    bottom_rewards: 'Rewards',
    bottom_menu: 'Menu',

    // Auth Screen
    tab_login: '🔐 Sign In',
    tab_register: '📝 New Sign Up',
    auth_subtitle_login: 'Field Audit & Worker Loyalty Access',
    auth_subtitle_register: 'Create New Mechanic / Worker Account',
    login_id_label: 'Mobile Number or Username',
    login_id_placeholder: '10-digit mobile or User ID (e.g. 9876510001 / MEC1001)',
    password_label: 'Password',
    password_placeholder: 'Enter your password',
    login_btn: 'Secure Login',
    new_worker_prompt: 'New worker or contractor?',
    signup_link: 'Sign Up for Rewards ➔',
    existing_user_prompt: 'Already registered?',
    signin_link: 'Sign In to Account ➔',
    pwa_install_btn: '📲 Install App on Phone (1-Tap)',

    // Worker Registration
    full_name: 'Full Name',
    full_name_placeholder: 'e.g. Ramesh Kumar',
    mobile_number: '10-Digit Mobile Number',
    trade_category: 'Work Trade / Category',
    choose_trade: '-- Choose Trade Category --',
    other_trade_opt: '✏️ Other / Custom Trade (Type below)',
    custom_trade_placeholder: 'Or type custom Trade / Specialty here...',
    shop_address: 'Workshop Address / Town Area',
    shop_address_placeholder: 'e.g. Cinema Road, Rosera',
    create_password: 'Create Password (min. 4 chars)',
    confirm_password: 'Confirm Password',
    register_btn: 'Complete Registration & Get ID',
    register_note: 'Mandatory 10-digit mobile number for account login & points alerts.',

    // Admin Dashboard
    admin_dash_title: 'Operations & Audit Dashboard',
    admin_dash_subtitle: 'Live business metrics and field audit oversight',
    verify_bills_btn: '🔍 Verify Bills',
    stat_total_mechanics: 'Total Mechanics',
    stat_active_in_field: 'Active in Field',
    stat_pending_verification: 'Pending Verification',
    stat_requires_action: 'Requires Auditor Action',
    stat_approved_purchases: 'Approved Purchases',
    stat_total_value: 'Total Value',
    stat_points_issued: 'Points Issued',
    stat_points_redeemed: 'Redeemed',
    stat_pending_claims: 'Pending Claims',
    stat_reward_redemptions: 'Reward Redemptions',
    stat_product_returns: 'Product Returns',
    stat_pts_reversed: 'pts reversed',
    chart_trade_breakdown: 'Trade Category Revenue Breakdown',
    field_cat_performance: 'Field Category Performance',
    field_cat_subtitle: 'Click any trade category to view its workers and profiles',
    full_report_btn: 'Full Report',
    th_trade_type: 'Trade Type (Click to Open)',
    th_workers: 'Workers',
    th_approved_sales: 'Approved Sales',
    th_pending_bills: 'Pending Bills',
    leaderboard_title: 'Top Performing Mechanics & Loyalty Points',
    recent_purchases_title: 'Recent Purchases & Audit Verification Status',

    // Worker Dashboard
    worker_welcome: 'Welcome',
    user_id_label: 'User ID',
    available_points: 'Available Points',
    lifetime_points: 'Lifetime Points',
    recovery_pending: 'Recovery Pending',
    ready_for_redemption: 'Ready for redemption',
    total_points_earned: 'Total points earned',
    deducted_future_bills: 'Deducted from future bills',
    submit_purchase_btn: '📸 Submit Purchase',
    recent_purchases: 'Recent Purchases',

    // Bill Submissions & Audits
    audit_queue_title: '🔍 Mobile Audit & Verification Queue',
    audit_queue_sub: 'Verify customer authenticity, bill receipt photos, and award points',
    all_caught_up: 'All Caught Up!',
    no_pending_bills: 'No pending bill submissions in the audit queue.',
    snap_new_bill: '📸 Snap New Bill',
    bill_receipt: 'Bill Receipt',
    call_customer: 'Call Customer',
    view_bill_photo: 'View Bill Photo',
    approve_credit_pts: '✓ Approve & Credit Points',
    reject_bill: '✕ Reject Bill',
    request_correction: '⚠️ Request Correction',
    points_to_award: 'Points to Award',
    rejection_reason: 'Rejection Reason',
    correction_msg: 'Correction Message',

    // Purchases Form
    submit_purchase_title: '📸 Submit Purchase & Bill',
    submit_purchase_sub: 'Upload bill photo and record customer purchase details',
    select_mechanic_title: '👷 Select Mechanic',
    choose_mech_dropdown: '-- Choose Mechanic from Dropdown --',
    search_mech_placeholder: 'Or type mechanic name, User ID (e.g. MEC1001), or phone...',
    cust_date_title: '👤 Customer & Date',
    purchase_date: 'Purchase Date',
    cust_name: 'Customer Name',
    cust_name_placeholder: 'Full name of customer',
    cust_phone: 'Customer Mobile Number',
    cust_addr: 'Customer Address / Area (Optional)',
    cust_addr_placeholder: 'Location, Street, City (Optional)',
    products_purchased_title: '📦 Products Purchased',
    optional_badge: '(Optional)',
    products_purchased_sub: 'Optional: Choose from the catalog or type any custom item name in the text field if not in the dropdown menu.',
    th_catalog_dd: 'Catalog Dropdown',
    th_item_name: 'Item Name / Text Field',
    th_quantity: 'Quantity',
    th_unit: 'Unit',
    add_product_line: '+ Add Product Line',
    amount_photo_title: '💰 Amount & Bill Photo',
    total_bill_amount: 'Total Bill Amount (₹)',
    bill_photo_receipt: 'Bill Photo / Receipt',
    bill_photo_sub: 'Take a photo of the bill if available (Optional).',
    submit_bill_btn: 'Submit Purchase & Generate Bill',

    // About Store View
    about_title: 'About Mahabir Traders',
    about_subtitle: 'Authorized Hub for Building Materials, Sanitaryware & Vitrified Tiles · Rosera, Samastipur',
    trusted_badge: '⭐ Trusted For Decades',
    authorized_hub_badge: '🏢 Authorized Hub',
    foundations_headline: 'Building Strong Foundations.',
    foundations_desc: 'Crafting modern sanitary & architectural living spaces across Samastipur & North Bihar. Single-window authorized source for certified steel, cement, designer tiles, and luxury sanitaryware in Rosera.',
    leadership_title: 'Leadership & Quality Promise',
    proprietor_name: 'Rajesh Kumar Khemka',
    proprietor_role: 'Proprietor & Managing Director',
    proprietors_message_title: "Proprietor's Message",
    proprietors_message: '“Delivering 100% factory-grade building materials and modern sanitary designs with complete integrity and wholesale pricing.”',
    call_rajesh: 'Call Rajesh Ji',
    whatsapp_rajesh: 'WhatsApp',
    store_location_label: 'Store Location & Dispatch Point:',
    store_location_val: 'Block Road, Rosera, Samastipur District, Bihar — 848210',
    map_btn: 'Map',
    walkthrough_title: 'Showroom Display & Studio',
    experience_zones: '3 Experience Zones',
    zone1_title: 'ZONE 01 · VANITY STUDIO',
    zone1_name: 'Designer Wash Basins & Mirror Displays',
    zone1_desc: 'Dual-tone gloss ceramic basins, luxury tabletop sinks, LED mirrors, and designer chrome fittings.',
    zone2_title: 'ZONE 02 · SLABS & TILES',
    zone2_name: 'Full-Height Sliding Vitrified Tile Racks',
    zone2_desc: 'Large-format PGVT glazed vitrified slabs, anti-skid floor tiles, and elevation displays.',
    zone3_title: 'ZONE 03 · SANITARY MART',
    zone3_name: 'Sanitaryware & Closets Showroom',
    zone3_desc: 'Rimless flushing EWCs, wall-hung concealed cisterns, and ceramic pedestal basins.',
    trust_genuine: '100% Genuine',
    trust_genuine_sub: 'Authorized Mill Stock',
    trust_dispatch: 'Bulk Dispatch',
    trust_dispatch_sub: 'Job-Site Logistics',
    trust_gst: 'GST Invoicing',
    trust_gst_sub: 'Transparent Billing',
    view_full_poster: '🔍 View Full Poster (HD)',
    copy_gstin: '📋 Copy GSTIN',
    tap_to_enlarge: '🔍 Tap to Enlarge Poster',

    // Returns & Reversals
    returns_title: '↩️ Product Returns, Reversals & Exchanges',
    returns_subtitle: 'Search verified purchases to process customer item returns, product replacements, and automatic points adjustments for workers.',
    search_purchases_return: '🔍 Search Customer Purchases for Return / Replacement',
    search_purchases_placeholder: '🔎 Type Customer Name, Mechanic Name, Phone Number, Bill ID (e.g. #102), or Product...',
    processed_returns_title: '📜 Processed Returns & Points Reversal History',

    // Rewards Catalog
    rewards_catalog_title: '🎁 Rewards Catalog',
    your_balance: 'Your Available Balance',
    add_reward_btn: '+ Add Reward Item',
    claim_reward_btn: 'Claim Reward',
    need_more_pts: 'Need {pts} more pts',

    // Mechanics Directory
    mechanics_directory_title: '👷 Mechanics Directory',
    mechanics_directory_sub: 'Manage accounts, points balance, and field profiles',
    register_mechanic_btn: '+ Register Mechanic',
    search_mechanics_placeholder: 'Search by name, phone, user ID, or address...',

    // Reports & Audit
    reports_title: '📈 Reports & Performance',
    top_mechanics_leaderboard: '🏆 Top Mechanics Leaderboard',
    export_csv: '📊 Export CSV',
    audit_logs_title: '📋 Comprehensive Audit Trail',
    audit_logs_sub: 'Immutable log of all approvals, rejections, points adjustments, and logins',

    // Settings
    settings_title: 'Admin Settings & Security',
    settings_subtitle: 'Manage administrator login credentials, username, secure password, and system preferences',
    system_settings_title: 'System Settings',
    system_settings_subtitle: 'System information and network configuration',
    language_preferences_title: 'Language Preferences / भाषा वरीयता',
    language_preferences_desc: 'Select your preferred language throughout the application:',
    admin_credentials_card: 'Administrator Account Credentials',
    save_credentials_btn: '💾 Save & Update Credentials',
    admin_username: 'Admin Login Username',
    admin_display_name: 'Admin Display Name',
    admin_contact_mobile: 'Admin Contact Mobile',
    change_admin_pw: 'Change Admin Password',
    new_pw: 'New Password',
    confirm_new_pw: 'Confirm New Password',
    current_pw: 'Current Password',
    sys_net_info: 'System & Network Information',
    primary_server_addr: 'Primary Server Address',

    // Messages
    lang_changed_toast: 'Language changed to English',
    logged_out_toast: 'Logged out successfully',

    // Category & Worker Details
    back_to_dash: '← Back to Dashboard',
    back_to_cat: '← Back to {cat} Category',
    all_mechanics_btn: '👷 All Mechanics',
    add_worker_btn: '+ Add {cat}',
    category_workers_title: '👷 {cat} Category Workers',
    category_workers_sub: "All registered {cat} professionals. Click any worker's name to view their complete profile, bills & transaction ledger.",
    total_in_cat: 'Total {cat}s',
    across_all_cat: 'Across all {cat}s',
    total_earned_to_date: 'Total earned to date',
    awaiting_audit: 'Awaiting bill audit',
    search_cat_placeholder: 'Search {cat}s by name, phone, user ID, or address...',
    no_workers_cat: 'No workers found registered in {cat} category.',
    th_user_id: 'User ID',
    th_worker_name_click: 'Worker Name (Click to View Details)',
    th_phone_contact: 'Phone / Quick Contact',
    th_address_shop: 'Address / Shop',
    th_avail_points: 'Available Points',
    th_lifetime_points: 'Lifetime Points',
    th_pending_bills_count: 'Pending Bills',
    th_status: 'Status',
    th_action: 'Action',
    view_full_profile: 'View Full Profile ➔',
    adjust_points_btn: '± Adjust Points',
    active_account: 'Active Account',
    inactive_account: 'Inactive',
    all_historical_bills: 'All historical bills submitted by {name}',
    points_ledger_title: '📜 Points Transaction Ledger & History',
    points_ledger_sub: 'Complete chronological audit statement of credits, debits, reversals, and adjustments',
    th_timestamp: 'Timestamp',
    th_txn_type: 'Transaction Type',
    th_desc_reason: 'Description / Reason',
    th_points_change: 'Points Change',
    th_bal_after: 'Balance After',
    th_auditor_actor: 'Auditor / System Actor',
    no_txns_found: 'No transaction records found.',
    no_purchases_found: 'No purchases submitted yet.',
    no_logs_found: 'No audit logs recorded.',
    no_redemptions_found: 'No redemptions requested.',
    th_actor: 'Actor',
    th_role: 'Role',
    th_details: 'Details',
    th_client_ip: 'Client IP',
    th_reward: 'Reward',
    download_audit_csv: '📊 Download Audit CSV',
    redemptions_title: '🏆 Reward Redemptions',
    redemptions_sub: 'Claims submitted by mechanics for rewards',
    filter_by_category: '👁️ Filter View by Worker Category:',
    visible_to_all: '🌟 Visible to All',
    item_to_sell: '📦 Item to Sell',
    reward_gift: '🎁 Reward Gift',
    on_selling: '📦 On Selling:',
    eligible_label: 'Eligible:',
    claim_reward: 'Claim Reward',
    need_more_pts_msg: 'Need {pts} more pts'
  },

  hi: {
    brand_name: 'महाबीर ट्रेडर्स',
    brand_tagline: 'मिस्त्री लॉयल्टी, रिवॉर्ड और फील्ड ऑडिट सिस्टम',
    lang_name: 'हिन्दी',
    switch_to_lang: 'View in English',
    language_selector: 'भाषा / Language',
    loading: 'डेटा लोड हो रहा है...',
    save: 'बदलाव सहेजें',
    cancel: 'रद्द करें',
    submit: 'जमा करें',
    search: 'खोजें...',
    all: 'सभी',
    view: 'देखें',
    actions: 'क्रियाएं',
    status: 'स्थिति',
    date: 'तारीख',
    phone: 'मोबाइल नंबर',
    address: 'पता / स्थान',
    customer: 'ग्राहक',
    amount: 'राशि',
    points: 'पॉइंट्स',
    total: 'कुल',
    items: 'सामग्री / सामान',
    logout: 'लॉगआउट',
    version: 'संस्करण',
    active: 'सक्रिय',
    inactive: 'निष्क्रिय',
    approved: 'स्वीकृत',
    pending: 'लंबित',
    rejected: 'अस्वीकृत',
    close: 'बंद करें',
    back: 'वापस',
    details: 'विवरण',
    profile: 'प्रोफ़ाइल',
    call_worker: 'कारीगर को कॉल करें',
    whatsapp: 'व्हाट्सएप',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    reset_pw: 'पासवर्ड रीसेट करें',
    activate: 'सक्रिय करें',
    deactivate: 'निष्क्रिय करें',
    refresh: 'रिफ्रेश',

    // User Roles
    role_admin: 'एडमिन',
    role_auditor: 'ऑडिटर',
    role_mechanic: 'कारीगर / मिस्त्री',

    // Navigation
    nav_dashboard: 'डैशबोर्ड अवलोकन',
    nav_about_store: 'महाबीर ट्रेडर्स के बारे में',
    nav_bill_audits: 'बिल ऑडिट कतार',
    nav_mechanics: 'मिस्त्री / कारीगर सूची',
    nav_purchases: 'खरीद व बिल रिकॉर्ड',
    nav_returns: 'वापसी व पॉइंट संशोधन',
    nav_rewards: 'इनाम कैटलॉग',
    nav_redemptions: 'इनाम निकासी',
    nav_reports: 'रिपोर्ट और रैंकिंग',
    nav_audit_logs: 'ऑडिट लॉग्स',
    nav_notifications: 'सूचनाएं',
    nav_settings: 'सेटिंग्स',
    nav_field_overview: 'फ़ील्ड अवलोकन',
    nav_snap_bill: 'बिल फोटो खींचे व दर्ज करें',
    nav_my_dashboard: 'मेरा डैशबोर्ड',
    nav_my_purchases: 'मेरे बिल रिकॉर्ड',
    nav_rewards_claim: 'इनाम और पॉइंट क्लेम',
    nav_redemption_history: 'इनाम निकासी इतिहास',

    // Mobile Bottom Nav
    bottom_dash: 'डैशबोर्ड',
    bottom_audits: 'ऑडिट',
    bottom_snap: 'फोटो बिल',
    bottom_returns: 'वापसी',
    bottom_home: 'होम',
    bottom_bills: 'बिल',
    bottom_rewards: 'इनाम',
    bottom_menu: 'मेनू',

    // Auth Screen
    tab_login: '🔐 साइन इन',
    tab_register: '📝 नया रजिस्ट्रेशन',
    auth_subtitle_login: 'फ़ील्ड ऑडिट और मिस्त्री लॉयल्टी पोर्टल',
    auth_subtitle_register: 'नया मिस्त्री / कारीगर खाता बनाएं',
    login_id_label: 'मोबाइल नंबर या यूज़रनेम',
    login_id_placeholder: '10 अंकों का मोबाइल या यूजर आईडी (उदा. 9876510001 / MEC1001)',
    password_label: 'पासवर्ड',
    password_placeholder: 'अपना पासवर्ड दर्ज करें',
    login_btn: 'सुरक्षित लॉगिन करें',
    new_worker_prompt: 'नया कारीगर या ठेकेदार हैं?',
    signup_link: 'रिवार्ड्स के लिए रजिस्टर करें ➔',
    existing_user_prompt: 'पहले से पंजीकृत हैं?',
    signin_link: 'खाते में साइन इन करें ➔',
    pwa_install_btn: '📲 फ़ोन पर ऐप इंस्टॉल करें (1-टैप)',

    // Worker Registration
    full_name: 'पूरा नाम',
    full_name_placeholder: 'उदा. रमेश कुमार',
    mobile_number: '10 अंकों का मोबाइल नंबर',
    trade_category: 'कार्य क्षेत्र / ट्रेड श्रेणी',
    choose_trade: '-- ट्रेड श्रेणी चुनें --',
    other_trade_opt: '✏️ अन्य / कस्टम ट्रेड (नीचे लिखें)',
    custom_trade_placeholder: 'या यहाँ कस्टम ट्रेड / विशेषता लिखें...',
    shop_address: 'दुकान / कार्यस्थल का पता',
    shop_address_placeholder: 'उदा. सिनेमा रोड, रोसड़ा',
    create_password: 'पासवर्ड बनाएं (कम से कम 4 अक्षर)',
    confirm_password: 'पासवर्ड की पुष्टि करें',
    register_btn: 'पंजीकरण पूरा करें और आईडी प्राप्त करें',
    register_note: 'खाता लॉगिन और पॉइंट्स सूचना के लिए 10 अंकों का मोबाइल नंबर अनिवार्य है।',

    // Admin Dashboard
    admin_dash_title: 'संचालन एवं ऑडिट डैशबोर्ड',
    admin_dash_subtitle: 'लाइव व्यापार मेट्रिक्स और फ़ील्ड ऑडिट निगरानी',
    verify_bills_btn: '🔍 बिल सत्यापित करें',
    stat_total_mechanics: 'कुल मिस्त्री / कारीगर',
    stat_active_in_field: 'फ़ील्ड में सक्रिय',
    stat_pending_verification: 'सत्यापन हेतु लंबित',
    stat_requires_action: 'ऑडिटर सत्यापन आवश्यक',
    stat_approved_purchases: 'स्वीकृत खरीद बिल',
    stat_total_value: 'कुल व्यापार मूल्य',
    stat_points_issued: 'जारी किए गए पॉइंट्स',
    stat_points_redeemed: 'निकासी किए गए',
    stat_pending_claims: 'लंबित इनाम दावे',
    stat_reward_redemptions: 'इनाम निकासी अनुरोध',
    stat_product_returns: 'सामग्री वापसी',
    stat_pts_reversed: 'पॉइंट्स वापस कटे',
    chart_trade_breakdown: 'ट्रेड श्रेणी अनुसार राजस्व विवरण',
    field_cat_performance: 'ट्रेड श्रेणी अनुसार प्रदर्शन',
    field_cat_subtitle: 'किसी भी ट्रेड श्रेणी पर क्लिक करके उनके कारीगर और प्रोफाइल देखें',
    full_report_btn: 'पूरी रिपोर्ट',
    th_trade_type: 'ट्रेड प्रकार (खोलने के लिए क्लिक करें)',
    th_workers: 'कारीगर',
    th_approved_sales: 'स्वीकृत बिक्री',
    th_pending_bills: 'लंबित बिल',
    leaderboard_title: 'शीर्ष प्रदर्शन करने वाले मिस्त्री और लॉयल्टी पॉइंट्स',
    recent_purchases_title: 'हालिया खरीद एवं बिल ऑडिट स्थिति',

    // Worker Dashboard
    worker_welcome: 'स्वागत है',
    user_id_label: 'यूजर आईडी',
    available_points: 'उपलब्ध पॉइंट्स',
    lifetime_points: 'कुल अर्जित पॉइंट्स (लाइफटाइम)',
    recovery_pending: 'लंबित रिकवरी',
    ready_for_redemption: 'इनाम निकासी के लिए तैयार',
    total_points_earned: 'कुल अर्जित पॉइंट्स',
    deducted_future_bills: 'आगामी बिलों से काटा जाएगा',
    submit_purchase_btn: '📸 नया बिल जमा करें',
    recent_purchases: 'हालिया खरीद रिकॉर्ड',

    // Bill Submissions & Audits
    audit_queue_title: '🔍 मोबाइल ऑडिट एवं सत्यापन कतार',
    audit_queue_sub: 'ग्राहक प्रमाणिकता, बिल फोटो जांचें और पॉइंट्स प्रदान करें',
    all_caught_up: 'सभी बिल सत्यापित हैं!',
    no_pending_bills: 'ऑडिट कतार में कोई लंबित बिल नहीं है।',
    snap_new_bill: '📸 नया बिल दर्ज करें',
    bill_receipt: 'बिल रसीद',
    call_customer: 'ग्राहक को कॉल करें',
    view_bill_photo: 'बिल फोटो देखें',
    approve_credit_pts: '✓ स्वीकृत करें और पॉइंट्स दें',
    reject_bill: '✕ बिल अस्वीकार करें',
    request_correction: '⚠️ सुधार का अनुरोध करें',
    points_to_award: 'दिए जाने वाले पॉइंट्स',
    rejection_reason: 'अस्वीकृति का कारण',
    correction_msg: 'सुधार संदेश',

    // Purchases Form
    submit_purchase_title: '📸 खरीद एवं बिल विवरण दर्ज करें',
    submit_purchase_sub: 'बिल फोटो अपलोड करें और ग्राहक खरीद विवरण दर्ज करें',
    select_mechanic_title: '👷 कारीगर / मिस्त्री चुनें',
    choose_mech_dropdown: '-- ड्रॉपडाउन से मिस्त्री चुनें --',
    search_mech_placeholder: 'या नाम, यूजर आईडी (उदा. MEC1001), या मोबाइल लिखें...',
    cust_date_title: '👤 ग्राहक एवं तारीख',
    purchase_date: 'खरीद की तारीख',
    cust_name: 'ग्राहक का नाम',
    cust_name_placeholder: 'ग्राहक का पूरा नाम',
    cust_phone: 'ग्राहक का मोबाइल नंबर',
    cust_addr: 'ग्राहक का पता / क्षेत्र (वैकल्पिक)',
    cust_addr_placeholder: 'स्थान, गली, शहर (वैकल्पिक)',
    products_purchased_title: '📦 खरीदी गई सामग्री',
    optional_badge: '(वैकल्पिक)',
    products_purchased_sub: 'वैकल्पिक: कैटलॉग से चुनें या ड्रॉपडाउन में न होने पर नाम टाइप करें।',
    th_catalog_dd: 'कैटलॉग ड्रॉपडाउन',
    th_item_name: 'सामग्री का नाम / विवरण',
    th_quantity: 'मात्रा',
    th_unit: 'इकाई',
    add_product_line: '+ और सामग्री जोड़ें',
    amount_photo_title: '💰 कुल राशि एवं बिल फोटो',
    total_bill_amount: 'कुल बिल राशि (₹)',
    bill_photo_receipt: 'बिल फोटो / रसीद',
    bill_photo_sub: 'यदि उपलब्ध हो तो बिल की फोटो खींचें (वैकल्पिक)।',
    submit_bill_btn: 'खरीद दर्ज करें और बिल बनाएं',

    // About Store View
    about_title: 'महाबीर ट्रेडर्स के बारे में',
    about_subtitle: 'भवन निर्माण सामग्री, सेनेटरीवेयर एवं विट्रीफाइड टाइल्स का अधिकृत हब · रोसड़ा, समस्तीपुर',
    trusted_badge: '⭐ दशकों का अटूट विश्वास',
    authorized_hub_badge: '🏢 अधिकृत डीलरशिप हब',
    foundations_headline: 'मजबूत नींव का निर्माण।',
    foundations_desc: 'समस्तीपुर और उत्तर बिहार में आधुनिक सेनेटरी और आवासीय स्थलों का निर्माण। रोसड़ा में प्रमाणित स्टील, सीमेंट, डिजाइनर टाइल्स और लक्जरी सेनेटरीवेयर का एकमात्र अधिकृत केंद्र।',
    leadership_title: 'नेतृत्व एवं गुणवत्ता का भरोसा',
    proprietor_name: 'राजेश कुमार खेमका',
    proprietor_role: 'प्रोपराइटर एवं प्रबंध निदेशक',
    proprietors_message_title: 'प्रोपराइटर का संदेश',
    proprietors_message: '“100% फैक्ट्री-ग्रेड निर्माण सामग्री और आधुनिक सेनेटरी डिज़ाइन्स को पूर्ण सत्यनिष्ठा और थोक दरों पर उपलब्ध कराना हमारा संकल्प है।”',
    call_rajesh: 'राजेश जी को कॉल करें',
    whatsapp_rajesh: 'व्हाट्सएप करें',
    store_location_label: 'स्टोर का पता एवं डिस्पैच पॉइंट:',
    store_location_val: 'ब्लॉक रोड, रोसड़ा, जिला समस्तीपुर, बिहार — 848210',
    map_btn: 'गूगल मैप',
    walkthrough_title: 'शोरूम डिस्प्ले और स्टूडियो वॉकथ्रू',
    experience_zones: '3 अनुभव ज़ोन (3 Zones)',
    zone1_title: 'ज़ोन 01 · वैनिटी स्टूडियो',
    zone1_name: 'डिज़ाइनर वॉश बेसिन एवं मिरर डिस्प्ले',
    zone1_desc: 'डुअल-टोन ग्लॉस सिरेमिक बेसिन, लक्जरी टेबलटॉप सिंक, एलईडी मिरर और डिज़ाइनर क्रोम फिटिंग्स।',
    zone2_title: 'ज़ोन 02 · स्लैब और टाइल्स',
    zone2_name: 'फुल-हाइट स्लाइडिंग विट्रीफाइड टाइल रैक्स',
    zone2_desc: 'बड़े आकार के पीजीवीटी ग्लेज्ड विट्रीफाइड स्लैब, एंटी-स्किड फ्लोर टाइल्स और एलिवेशन डिस्प्ले।',
    zone3_title: 'ज़ोन 03 · सेनेटरी मार्ट',
    zone3_name: 'सेनेटरीवेयर और क्लोजेट्स शोरूम',
    zone3_desc: 'रिमलेस फ्लशिंग ईडब्ल्यूसी, वॉल-हंग कंसील्ड सिस्टर्न और सिरेमिक पेडस्टल बेसिन।',
    trust_genuine: '100% असली माल',
    trust_genuine_sub: 'अधिकृत मिल स्टॉक',
    trust_dispatch: 'थोक डिलीवरी',
    trust_dispatch_sub: 'साइट तक सुरक्षित लॉजिस्टिक्स',
    trust_gst: 'जीएसटी बिलिंग',
    trust_gst_sub: 'पारदर्शी बिल व पक्की रसीद',
    view_full_poster: '🔍 पूरा पोस्टर देखें (HD)',
    copy_gstin: '📋 GSTIN कॉपी करें',
    tap_to_enlarge: '🔍 बड़ा पोस्टर देखने के लिए टैप करें',

    // Returns & Reversals
    returns_title: '↩️ सामग्री वापसी, पॉइंट संशोधन एवं एक्सचेंज',
    returns_subtitle: 'ग्राहक सामग्री वापसी, उत्पाद बदलाव और कारीगरों के लिए स्वचालित पॉइंट समायोजन हेतु खरीद खोजें।',
    search_purchases_return: '🔍 वापसी / बदलाव के लिए ग्राहक खरीद खोजें',
    search_purchases_placeholder: '🔎 ग्राहक का नाम, कारीगर का नाम, मोबाइल नंबर, बिल आईडी (उदा. #102), या सामग्री लिखें...',
    processed_returns_title: '📜 सामग्री वापसी एवं पॉइंट कटौती इतिहास',

    // Rewards Catalog
    rewards_catalog_title: '🎁 इनाम कैटलॉग',
    your_balance: 'आपकी उपलब्ध पॉइंट राशि',
    add_reward_btn: '+ नया इनाम जोड़ें',
    claim_reward_btn: 'इनाम क्लेम करें',
    need_more_pts: '{pts} और पॉइंट्स चाहिए',

    // Mechanics Directory
    mechanics_directory_title: '👷 मिस्त्री / कारीगर सूची',
    mechanics_directory_sub: 'खाते, पॉइंट बैलेंस और फ़ील्ड प्रोफ़ाइल प्रबंधित करें',
    register_mechanic_btn: '+ नया मिस्त्री पंजीकृत करें',
    search_mechanics_placeholder: 'नाम, मोबाइल, यूजर आईडी, या पते से खोजें...',

    // Reports & Audit
    reports_title: '📈 रिपोर्ट और प्रदर्शन',
    top_mechanics_leaderboard: '🏆 शीर्ष कारीगर रैंकिंग (लीडरबोर्ड)',
    export_csv: '📊 CSV डाउनलोड करें',
    audit_logs_title: '📋 संपूर्ण ऑडिट ट्रेल',
    audit_logs_sub: 'स्वीकृतियों, अस्वीकृतियों, पॉइंट समायोजन और लॉगिन का स्थायी रिकॉर्ड',

    // Settings
    settings_title: 'एडमिन सेटिंग्स एवं सुरक्षा',
    settings_subtitle: 'एडमिनिस्ट्रेटर लॉगिन क्रेडेंशियल्स, यूज़रनेम, सुरक्षित पासवर्ड और सिस्टम वरीयताएं प्रबंधित करें',
    system_settings_title: 'सिस्टम सेटिंग्स',
    system_settings_subtitle: 'सिस्टम जानकारी और नेटवर्क कॉन्फ़िगरेशन',
    language_preferences_title: 'भाषा वरीयता (Language Preferences)',
    language_preferences_desc: 'पूरे एप्लिकेशन में अपनी पसंदीदा भाषा चुनें:',
    admin_credentials_card: 'एडमिनिस्ट्रेटर खाता क्रेडेंशियल्स',
    save_credentials_btn: '💾 बदलाव सुरक्षित करें',
    admin_username: 'एडमिन लॉगिन यूज़रनेम',
    admin_display_name: 'एडमिन डिस्प्ले नाम',
    admin_contact_mobile: 'एडमिन संपर्क मोबाइल नंबर',
    change_admin_pw: 'एडमिन पासवर्ड बदलें',
    new_pw: 'नया पासवर्ड',
    confirm_new_pw: 'नए पासवर्ड की पुष्टि करें',
    current_pw: 'वर्तमान पासवर्ड',
    sys_net_info: 'सिस्टम एवं नेटवर्क जानकारी',
    primary_server_addr: 'प्राइमरी सर्वर पता',

    // Messages
    lang_changed_toast: 'भाषा बदलकर हिन्दी कर दी गई है',
    logged_out_toast: 'सफलतापूर्वक लॉगआउट कर दिया गया',

    // Category & Worker Details
    back_to_dash: '← डैशबोर्ड पर वापस',
    back_to_cat: '← {cat} श्रेणी पर वापस',
    all_mechanics_btn: '👷 सभी मिस्त्री',
    add_worker_btn: '+ नया {cat} जोड़ें',
    category_workers_title: '👷 {cat} ट्रेड कारीगर',
    category_workers_sub: 'सभी पंजीकृत {cat} कारीगर। किसी भी कारीगर के नाम पर क्लिक करके उनकी प्रोफ़ाइल, बिल और पॉइंट लेज़र देखें।',
    total_in_cat: 'कुल {cat}',
    across_all_cat: 'सभी {cat} में',
    total_earned_to_date: 'अब तक कुल अर्जित',
    awaiting_audit: 'ऑडिट सत्यापन हेतु प्रतीक्षारत',
    search_cat_placeholder: 'नाम, मोबाइल, यूजर आईडी, या पते से {cat} खोजें...',
    no_workers_cat: '{cat} श्रेणी में कोई कारीगर पंजीकृत नहीं मिला।',
    th_user_id: 'यूजर आईडी',
    th_worker_name_click: 'कारीगर का नाम (विवरण हेतु क्लिक करें)',
    th_phone_contact: 'मोबाइल / त्वरित संपर्क',
    th_address_shop: 'दुकान / स्थान का पता',
    th_avail_points: 'उपलब्ध पॉइंट्स',
    th_lifetime_points: 'लाइफटाइम पॉइंट्स',
    th_pending_bills_count: 'लंबित बिल',
    th_status: 'स्थिति',
    th_action: 'कार्रवाई',
    view_full_profile: 'पूरी प्रोफ़ाइल देखें ➔',
    adjust_points_btn: '± पॉइंट्स जोड़ें/घटाएं',
    active_account: 'सक्रिय खाता',
    inactive_account: 'निष्क्रिय',
    all_historical_bills: '{name} द्वारा प्रस्तुत सभी ऐतिहासिक बिल रिकॉर्ड',
    points_ledger_title: '📜 पॉइंट लेनदेन लेज़र एवं इतिहास',
    points_ledger_sub: 'क्रेडिट, डेबिट, पॉइंट कटौती और समायोजन का पूर्ण कालक्रमानुसार रिकॉर्ड',
    th_timestamp: 'समय',
    th_txn_type: 'लेनदेन प्रकार',
    th_desc_reason: 'विवरण / कारण',
    th_points_change: 'पॉइंट्स बदलाव',
    th_bal_after: 'शेष बैलेंस',
    th_auditor_actor: 'ऑडिटर / सिस्टम',
    no_txns_found: 'कोई लेनदेन रिकॉर्ड नहीं मिला।',
    no_purchases_found: 'अभी तक कोई बिल जमा नहीं किया गया।',
    no_logs_found: 'कोई ऑडिट लॉग रिकॉर्ड नहीं मिला।',
    no_redemptions_found: 'कोई निकासी अनुरोध नहीं मिला।',
    th_actor: 'यूजर / कर्ता',
    th_role: 'भूमिका',
    th_details: 'विवरण',
    th_client_ip: 'क्लाइंट आईपी',
    th_reward: 'इनाम',
    download_audit_csv: '📊 ऑडिट CSV डाउनलोड करें',
    redemptions_title: '🏆 इनाम निकासी अनुरोध',
    redemptions_sub: 'कारीगरों द्वारा इनाम निकासी के लिए भेजे गए दावे',
    filter_by_category: '👁️ ट्रेड श्रेणी अनुसार देखें:',
    visible_to_all: '🌟 सभी ट्रेड्स के लिए',
    item_to_sell: '📦 बिक्री सामग्री',
    reward_gift: '🎁 उपहार / इनाम',
    on_selling: '📦 इस सामग्री की बिक्री पर:',
    eligible_label: 'पात्रता:',
    claim_reward: 'इनाम क्लेम करें',
    need_more_pts_msg: '{pts} और पॉइंट्स चाहिए'
  }
};

function t(key, fallback = '', params = {}) {
  const currentLang = AppState.lang || 'en';
  let val = I18N[currentLang]?.[key] || I18N['en']?.[key] || fallback || key;
  if (params && typeof params === 'object') {
    Object.keys(params).forEach(k => {
      val = val.replace(new RegExp(`\\{${k}\\}`, 'g'), params[k]);
    });
  }
  return val;
}

function setLanguage(lang) {
  if (lang !== 'en' && lang !== 'hi') lang = 'en';
  AppState.lang = lang;
  localStorage.setItem('mahabir_app_lang', lang);
  document.documentElement.lang = lang;
  
  if (!AppState.user) {
    renderLoginView(activeAuthTab || 'login');
  } else {
    renderView();
  }
  showToast(t('lang_changed_toast'), 'success');
}

function toggleLanguage() {
  const target = AppState.lang === 'hi' ? 'en' : 'hi';
  setLanguage(target);
}

function renderLangSwitcherHtml(variant = 'light') {
  const isHi = AppState.lang === 'hi';
  return `
    <div class="lang-segmented-group ${variant === 'dark' ? 'dark' : ''}">
      <button type="button" class="lang-segmented-btn ${!isHi ? 'active' : ''}" onclick="setLanguage('en')">English</button>
      <button type="button" class="lang-segmented-btn ${isHi ? 'active' : ''}" onclick="setLanguage('hi')">हिन्दी</button>
    </div>
  `;
}

let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  const btn = document.getElementById('pwa-install-banner-btn');
  if (btn) btn.style.display = 'block';
});

async function triggerPwaInstall() {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    if (outcome === 'accepted') {
      const msg = AppState.lang === 'hi' 
        ? 'ऐप सफलतापूर्वक इंस्टॉल हो गया! आप महाबीर ट्रेडर्स को अपने ऐप्स / होम स्क्रीन पर पा सकते हैं।'
        : 'App installed successfully! You can find Mahabir Traders in your apps / home screen.';
      showToast(msg, 'success');
      const btn = document.getElementById('pwa-install-banner-btn');
      if (btn) btn.style.display = 'none';
    }
    deferredInstallPrompt = null;
  } else {
    // Show visual step-by-step installation guide for iOS & other Android browsers
    openInstallGuideModal();
  }
}

function openInstallGuideModal() {
  const isHi = AppState.lang === 'hi';
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  modalRoot.innerHTML = `
    <div class="modal-backdrop" onclick="closeModal()">
      <div class="modal-content" style="max-width:480px;text-align:left;" onclick="event.stopPropagation()">
        
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
          <div style="display:flex;align-items:center;gap:10px;">
            <img src="/icons/icon-192.png" style="width:40px;height:40px;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.15);" alt="Mahabir App Icon" />
            <div>
              <h3 style="font-size:17px;font-weight:800;color:var(--primary);margin:0;">
                ${isHi ? 'फ़ोन पर ऐप इंस्टॉल करें' : 'Install App on Phone'}
              </h3>
              <small style="color:var(--text-muted);font-size:12px;">Mahabir Traders (1-Tap Home Screen)</small>
            </div>
          </div>
          <button class="modal-close" onclick="closeModal()">✕</button>
        </div>

        <div style="background:#F8FAFC;border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px;margin-bottom:14px;">
          <h4 style="font-size:14px;font-weight:700;color:#0F172A;margin:0 0 8px 0;">
            ${isHi ? '🤖 एंड्रॉयड फ़ोन (Chrome / Samsung):' : '🤖 Android (Chrome / Samsung Browser):'}
          </h4>
          <ol style="margin:0 0 0 18px;padding:0;font-size:13px;line-height:1.6;color:var(--text);">
            <li>${isHi ? 'ब्राउज़र के ऊपर दाईं ओर <b>तीन बिंदु (⋮)</b> मेनू पर टैप करें।' : 'Tap the <b>three dots (⋮)</b> menu at top-right.'}</li>
            <li>${isHi ? '<b>"Install App"</b> या <b>"Add to Home Screen"</b> (होम स्क्रीन पर जोड़ें) चुनें।' : 'Select <b>"Install App"</b> or <b>"Add to Home Screen"</b>.'}</li>
            <li>${isHi ? 'ऐप आइकन आपके फ़ोन स्क्रीन पर आ जाएगा।' : 'The app icon will be added to your home screen.'}</li>
          </ol>
        </div>

        <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:var(--radius-sm);padding:14px;margin-bottom:16px;">
          <h4 style="font-size:14px;font-weight:700;color:#1E40AF;margin:0 0 8px 0;">
            ${isHi ? '🍏 आईफ़ोन (iPhone / Safari):' : '🍏 Apple iPhone (Safari):'}
          </h4>
          <ol style="margin:0 0 0 18px;padding:0;font-size:13px;line-height:1.6;color:#1E3A8A;">
            <li>${isHi ? 'नीचे दिए गए <b>शेयर आइकन (⎋)</b> पर टैप करें।' : 'Tap the <b>Share icon (⎋)</b> at the bottom bar.'}</li>
            <li>${isHi ? 'नीचे स्क्रॉल करके <b>"Add to Home Screen" (+)</b> पर टैप करें।' : 'Scroll down and tap <b>"Add to Home Screen" (+)</b>.'}</li>
            <li>${isHi ? 'ऊपर दाईं ओर <b>"Add"</b> दबाएं।' : 'Tap <b>"Add"</b> at the top right.'}</li>
          </ol>
        </div>

        <button type="button" class="btn btn-primary" style="width:100%;" onclick="closeModal()">
          ${isHi ? 'समझ गया (बंद करें)' : 'Got it (Close)'}
        </button>

      </div>
    </div>
  `;
}

// Trade Types List
const TRADE_TYPES = ['Plumber', 'Painters', 'Tiles Mistri', 'Carpenters', 'Raj Mistri', 'Others'];

// Auth Fetch Helper
async function apiFetch(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  if (AppState.token) {
    headers['Authorization'] = `Bearer ${AppState.token}`;
  }

  try {
    const res = await fetch(endpoint, { ...options, headers });
    let data = null;
    try {
      data = await res.json();
    } catch (e) {}

    if (res.status === 401) {
      if (endpoint.includes('/api/auth/login')) {
        throw new Error(data?.error || 'Wrong password or username');
      }
      // Silently clean up expired session without showing popup on initial page load
      logout(false);
      const err = new Error(data?.error || 'Session expired');
      err.isAuthCheck = true;
      throw err;
    }

    if (!res.ok) {
      throw new Error(data?.error || 'Server error');
    }
    return data;
  } catch (err) {
    // Only display popup if it's not a silent auth check or initial session load
    if (!options.silent && !err.isAuthCheck && !endpoint.includes('/api/auth/me')) {
      showToast(err.message, 'error');
    }
    throw err;
  }
}

// Toast Notification System (1 Second Display)
function showToast(msg, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  // Cap active visible toasts to 3
  while (container.children.length >= 3) {
    container.firstElementChild.remove();
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️';
  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-icon">${icon}</span>
      <span class="toast-msg">${msg}</span>
    </div>
    <button type="button" class="toast-close" title="Dismiss" onclick="dismissToast(this.closest('.toast'))">✕</button>
  `;

  container.appendChild(toast);

  // Auto-dismiss after exactly 1 second (1000ms)
  const timer = setTimeout(() => {
    dismissToast(toast);
  }, 1000);
  toast._dismissTimer = timer;
}

function dismissToast(toastEl) {
  if (!toastEl || toastEl._isDismissing) return;
  toastEl._isDismissing = true;
  if (toastEl._dismissTimer) clearTimeout(toastEl._dismissTimer);
  toastEl.classList.add('toast-fade-out');
  setTimeout(() => {
    if (toastEl && toastEl.parentNode) {
      toastEl.remove();
    }
  }, 180);
}

// Format Currency
function formatINR(val) {
  return '₹' + Number(val || 0).toLocaleString('en-IN');
}

// Universal Dropdown & Custom Text Sync Helper
function handleDropdownWithCustom(selectEl, customInputId) {
  const customInp = document.getElementById(customInputId);
  if (!customInp) return;
  if (selectEl.value === '__custom__') {
    customInp.value = '';
    customInp.focus();
  } else if (selectEl.value) {
    customInp.value = selectEl.options[selectEl.selectedIndex].text.replace(/\s*\(.*?\)\s*/g, '').trim() || selectEl.value;
  }
}

// Searchable Mechanic Input Sync Helper
function handlePurMechSearchInput(input) {
  const query = input.value.trim().toLowerCase();
  const selectEl = document.getElementById('pur-mechanic-id');
  if (!selectEl || !query) return;
  for (let i = 0; i < selectEl.options.length; i++) {
    const opt = selectEl.options[i];
    if (opt.text.toLowerCase().includes(query)) {
      selectEl.selectedIndex = i;
      break;
    }
  }
}

// Initialize App
async function initApp() {
  renderShell();
  if (AppState.token) {
    try {
      const res = await API.get('/api/auth/me');
      AppState.user = res.user;
      startAutoSync();
      navigate(AppState.user.role === 'auditor' ? 'audit_feed' : 'dash');
    } catch (e) {
      logout(false);
    }
  } else {
    navigate('login');
  }
}

// Start Background Auto-Sync every 8 seconds for multi-device synchronization
function startAutoSync() {
  if (AppState.pollTimer) clearInterval(AppState.pollTimer);
  AppState.pollTimer = setInterval(async () => {
    if (!AppState.user) return;
    try {
      if (AppState.user.role === 'admin' || AppState.user.role === 'auditor') {
        const statsRes = await API.get('/api/dashboard/stats');
        AppState.stats = statsRes;
        if (AppState.view === 'dash') renderAdminDashboard();
        if (AppState.view === 'audit_feed') loadAuditorFeedData();
      }
    } catch (e) {
      // Background sync silently handles temporary glitches
    }
  }, 8000);
}

// Navigation Router
// Navigation Router
function navigate(view, subId = null) {
  AppState.view = view;
  AppState.subViewId = subId;
  toggleMobileDrawer(false);
  renderView();
}

// Top-level HTML shell renderer
function renderShell() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="phone-wrapper">
      <div class="phone-frame" id="phone-frame">
        <div id="toast-container"></div>
        <div id="modal-root"></div>
        <div id="mobile-header-slot"></div>
        <div id="mobile-drawer-slot"></div>
        <div class="app-container" id="app-container">
          <main class="main-content" id="main-content"></main>
        </div>
        <nav class="bottom-nav" id="bottom-nav-slot"></nav>
      </div>
    </div>
  `;
}

// Mobile Slide Drawer Toggle
function toggleMobileDrawer(open) {
  const backdrop = document.getElementById('mobile-drawer-backdrop');
  const drawer = document.getElementById('mobile-drawer');
  if (backdrop && drawer) {
    if (open) {
      backdrop.classList.add('open');
      drawer.classList.add('open');
    } else {
      backdrop.classList.remove('open');
      drawer.classList.remove('open');
    }
  }
}

// Render Top Mobile App Header
function renderMobileHeader() {
  const slot = document.getElementById('mobile-header-slot');
  if (!slot) return;
  if (!AppState.user) {
    slot.innerHTML = '';
    return;
  }

  const role = AppState.user.role;
  const roleName = role === 'admin' ? t('role_admin') : role === 'auditor' ? t('role_auditor') : (AppState.user.mechanic?.trade_type || t('role_mechanic'));

  slot.innerHTML = `
    <header class="mobile-header">
      <div class="mobile-header-left">
        <button class="mobile-menu-btn" onclick="toggleMobileDrawer(true)" aria-label="Open Navigation Menu">
          ☰
        </button>
        <div class="mobile-brand-title" onclick="navigate('dash')" style="cursor:pointer;">
          <span>🏪</span>
          <span>${t('brand_name')}</span>
          <span class="user-badge role-${role}" style="font-size:10px;padding:1px 5px;">${roleName}</span>
        </div>
      </div>

      <div class="mobile-header-right">
        <button class="lang-switcher-btn" onclick="toggleLanguage()" title="Switch Language / भाषा बदलें">
          <span>🌐</span>
          <span>${AppState.lang === 'hi' ? 'EN' : 'हिन्दी'}</span>
        </button>
        <button class="mobile-icon-btn" onclick="navigate('notifications')" title="${t('nav_notifications')}">
          🔔
        </button>
        <button class="mobile-icon-btn" onclick="toggleMobileDrawer(true)" title="Profile & Menu" style="background:var(--accent);color:#fff;font-weight:700;font-size:12px;">
          ${(AppState.user.name || 'U').charAt(0).toUpperCase()}
        </button>
      </div>
    </header>
  `;
}

// Render Full Mobile Slide-Out Drawer
function renderMobileDrawer() {
  const slot = document.getElementById('mobile-drawer-slot');
  if (!slot) return;
  if (!AppState.user) {
    slot.innerHTML = '';
    return;
  }

  const role = AppState.user.role;
  let navItems = [];

  if (role === 'admin') {
    navItems = [
      { id: 'dash', icon: '📊', label: t('nav_dashboard') },
      { id: 'about', icon: '🏪', label: t('nav_about_store') },
      { id: 'verifications', icon: '🔍', label: t('nav_bill_audits'), count: AppState.stats.pendingBills || 0 },
      { id: 'mechanics', icon: '👷', label: t('nav_mechanics') },
      { id: 'purchases', icon: '🧾', label: t('nav_purchases') },
      { id: 'returns', icon: '↩️', label: t('nav_returns') },
      { id: 'rewards', icon: '🎁', label: t('nav_rewards') },
      { id: 'redemptions', icon: '🏆', label: t('nav_redemptions'), count: AppState.stats.pendingRedemptions || 0 },
      { id: 'reports', icon: '📈', label: t('nav_reports') },
      { id: 'audit_logs', icon: '📋', label: t('nav_audit_logs') },
      { id: 'notifications', icon: '🔔', label: t('nav_notifications') },
      { id: 'settings', icon: '⚙️', label: t('nav_settings') }
    ];
  } else if (role === 'auditor') {
    navItems = [
      { id: 'dash', icon: '📊', label: t('nav_field_overview') },
      { id: 'about', icon: '🏪', label: t('nav_about_store') },
      { id: 'audit_feed', icon: '🔍', label: t('nav_bill_audits'), count: AppState.stats.pendingBills || 0 },
      { id: 'submit_purchase', icon: '📸', label: t('nav_snap_bill') },
      { id: 'mechanics', icon: '👷', label: t('nav_mechanics') },
      { id: 'purchases', icon: '🧾', label: t('nav_purchases') },
      { id: 'returns', icon: '↩️', label: t('nav_returns') },
      { id: 'audit_logs', icon: '📋', label: t('nav_audit_logs') },
      { id: 'notifications', icon: '🔔', label: t('nav_notifications') }
    ];
  } else {
    navItems = [
      { id: 'dash', icon: '🏠', label: t('nav_my_dashboard') },
      { id: 'about', icon: '🏪', label: t('nav_about_store') },
      { id: 'submit_purchase', icon: '📸', label: t('nav_snap_bill') },
      { id: 'purchases', icon: '🧾', label: t('nav_my_purchases') },
      { id: 'rewards', icon: '🎁', label: t('nav_rewards_claim') },
      { id: 'redemptions', icon: '🏆', label: t('nav_redemption_history') },
      { id: 'notifications', icon: '🔔', label: t('nav_notifications') }
    ];
  }

  let mechPts = 0;
  if (role === 'mechanic' && AppState.user.mechanic) {
    mechPts = AppState.user.mechanic.available_points || 0;
  }

  slot.innerHTML = `
    <div class="mobile-drawer-backdrop" id="mobile-drawer-backdrop" onclick="toggleMobileDrawer(false)"></div>
    <div class="mobile-drawer" id="mobile-drawer">
      <div class="mobile-drawer-header">
        <div class="mobile-drawer-user">
          <div style="font-size:16px;font-weight:700;color:#fff;display:flex;align-items:center;gap:6px;">
            <span>🏪 ${t('brand_name')}</span>
          </div>
          <div style="font-size:14px;font-weight:600;color:#38BDF8;margin-top:4px;">${AppState.user.name}</div>
          <div style="display:flex;align-items:center;gap:6px;margin-top:2px;">
            <span class="user-badge role-${role}">${role}</span>
            ${role === 'mechanic' ? `<span style="font-size:11px;color:#4ADE80;font-weight:700;">${mechPts} pts</span>` : ''}
          </div>
          <div style="margin-top:8px;">
            ${renderLangSwitcherHtml('dark')}
          </div>
        </div>
        <button class="mobile-drawer-close" onclick="toggleMobileDrawer(false)">✕</button>
      </div>

      <div class="mobile-drawer-nav">
        ${navItems.map(item => `
          <a class="mobile-drawer-item ${AppState.view === item.id ? 'active' : ''}" onclick="navigate('${item.id}')">
            <span style="font-size:18px;">${item.icon}</span>
            <span>${item.label}</span>
            ${item.count ? `<span class="badge-count">${item.count}</span>` : ''}
          </a>
        `).join('')}
      </div>

      <div class="mobile-drawer-footer">
        <button class="btn btn-danger btn-sm" style="width:100%;" onclick="logout(true)">
          🚪 ${t('logout')}
        </button>
      </div>
    </div>
  `;
}

// Auditor Dashboard helper
async function renderAuditorDashboard() {
  await renderBillVerifications();
}

// Render the active view
async function renderView() {
  if (!AppState.user) {
    renderLoginView();
    return;
  }

  renderMobileHeader();
  renderMobileDrawer();
  renderSidebar();
  renderBottomNav();

  const main = document.getElementById('main-content');
  main.innerHTML = `<div style="text-align:center;padding:40px;"><p>${t('loading')}</p></div>`;

  try {
    switch (AppState.view) {
      case 'dash':
        if (AppState.user.role === 'admin') await renderAdminDashboard();
        else if (AppState.user.role === 'auditor') await renderAuditorDashboard();
        else await renderMechanicDashboard();
        break;
      case 'category_workers':
        await renderCategoryWorkers(AppState.subViewId);
        break;
      case 'audit_feed':
      case 'verifications':
        await renderBillVerifications();
        break;
      case 'mechanics':
        await renderMechanicsList();
        break;
      case 'mechanic_detail':
        await renderMechanicDetail(AppState.subViewId);
        break;
      case 'purchases':
        await renderPurchasesList();
        break;
      case 'submit_purchase':
        await renderSubmitPurchase();
        break;
      case 'returns':
        await renderReturnsView();
        break;
      case 'process_return':
        await renderProcessReturn(AppState.subViewId);
        break;
      case 'rewards':
        await renderRewardsView();
        break;
      case 'redemptions':
        await renderRedemptionsView();
        break;
      case 'audit_logs':
        await renderAuditLogsView();
        break;
      case 'reports':
        await renderReportsView();
        break;
      case 'about':
        await renderAboutView();
        break;
      case 'settings':
        await renderSettingsView();
        break;
      case 'notifications':
        await renderNotificationsView();
        break;
      default:
        navigate('dash');
    }
  } catch (err) {
    console.error('Render error:', err);
    main.innerHTML = `<div class="card"><p style="color:var(--danger)">Failed to load view: ${err.message}</p><button class="btn btn-primary" onclick="renderView()">Retry</button></div>`;
  }
}

// Sidebar Navigation (Unneeded in unified mobile-first phone frame)
function renderSidebar() {
  const sidebar = document.getElementById('sidebar-slot');
  if (sidebar) sidebar.innerHTML = '';
}

// Mobile Bottom Navigation Bar (With 1-Tap Access to All Features via Menu)
function renderBottomNav() {
  const bottomNav = document.getElementById('bottom-nav-slot');
  if (!AppState.user) {
    bottomNav.innerHTML = '';
    return;
  }

  const role = AppState.user.role;
  let items = [];

  if (role === 'admin') {
    items = [
      { id: 'dash', icon: '📊', label: t('bottom_dash') },
      { id: 'verifications', icon: '🔍', label: t('bottom_audits'), count: AppState.stats.pendingBills || 0 },
      { id: 'submit_purchase', icon: '📸', label: t('bottom_snap') },
      { id: 'returns', icon: '↩️', label: t('bottom_returns') },
      { id: 'more', icon: '☰', label: t('bottom_menu'), isMenu: true }
    ];
  } else if (role === 'auditor') {
    items = [
      { id: 'dash', icon: '📊', label: t('bottom_dash') },
      { id: 'audit_feed', icon: '🔍', label: t('bottom_audits'), count: AppState.stats.pendingBills || 0 },
      { id: 'submit_purchase', icon: '📸', label: t('bottom_snap') },
      { id: 'returns', icon: '↩️', label: t('bottom_returns') },
      { id: 'more', icon: '☰', label: t('bottom_menu'), isMenu: true }
    ];
  } else {
    items = [
      { id: 'dash', icon: '🏠', label: t('bottom_home') },
      { id: 'submit_purchase', icon: '📸', label: t('bottom_snap') },
      { id: 'purchases', icon: '🧾', label: t('bottom_bills') },
      { id: 'rewards', icon: '🎁', label: t('bottom_rewards') },
      { id: 'more', icon: '☰', label: t('bottom_menu'), isMenu: true }
    ];
  }

  bottomNav.innerHTML = items.map(it => `
    <a class="bottom-nav-item ${!it.isMenu && AppState.view === it.id ? 'active' : ''}" onclick="${it.isMenu ? 'toggleMobileDrawer(true)' : `navigate('${it.id}')`}">
      <span class="bottom-nav-icon">${it.icon}</span>
      <span>${it.label}</span>
      ${it.count ? `<span class="badge-count" style="position:absolute;top:4px;right:18px;font-size:10px;padding:1px 5px;">${it.count}</span>` : ''}
    </a>
  `).join('');
}

/* =========================================================================
   AUTH, SIGN UP & PASSWORD RESET (WITH MOBILE OTP)
   ========================================================================= */

let activeAuthTab = 'login';

function renderLoginView(tab = 'login', prefillPhone = '') {
  activeAuthTab = tab;
  const main = document.getElementById('main-content');
  const sidebar = document.getElementById('sidebar-slot');
  if (sidebar) sidebar.innerHTML = '';
  const bottomNav = document.getElementById('bottom-nav-slot');
  if (bottomNav) bottomNav.innerHTML = '';
  const mobileHeader = document.getElementById('mobile-header-slot');
  if (mobileHeader) mobileHeader.innerHTML = '';
  const mobileDrawer = document.getElementById('mobile-drawer-slot');
  if (mobileDrawer) mobileDrawer.innerHTML = '';

  main.innerHTML = `
    <div class="auth-container">
      <div class="card auth-card">
        
        <!-- Language Switcher Bar on Top of Login -->
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid var(--border);">
          <span style="font-size:12px;font-weight:700;color:var(--text-muted);display:flex;align-items:center;gap:4px;">
            <span>🌐</span> Language / भाषा:
          </span>
          ${renderLangSwitcherHtml('light')}
        </div>

        <div style="text-align: center; margin-bottom: 20px;">
          <div style="font-size: 38px; margin-bottom: 8px;">🏪</div>
          <h2 style="font-size: 22px; font-weight: 800; color: var(--primary); letter-spacing: 0.5px; margin: 0 0 4px 0;">${t('brand_name').toUpperCase()}</h2>
          <p style="font-size: 13px; font-weight: 600; color: var(--accent); margin-top: 2px;">${t('brand_tagline')}</p>
        </div>

        <button type="button" class="btn btn-success" id="pwa-install-banner-btn" style="width:100%;margin-bottom:14px;" onclick="triggerPwaInstall()">📲 Install App on Phone (1-Tap)</button>

        <!-- Auth Tabs: Sign In / Sign Up -->
        <div class="auth-tab-group">
          <button type="button" class="auth-tab-btn ${activeAuthTab === 'login' ? 'active' : ''}" onclick="renderLoginView('login')">
            ${t('tab_login')}
          </button>
          <button type="button" class="auth-tab-btn ${activeAuthTab === 'signup' ? 'active' : ''}" onclick="renderLoginView('signup')">
            ${t('tab_register')}
          </button>
        </div>

        ${activeAuthTab === 'login' ? `
          <!-- Sign In Form -->
          <form id="login-form" onsubmit="handleLoginSubmit(event)">
            <div class="form-group">
              <label>${t('login_id_label')}</label>
              <input type="text" id="login-username" value="${prefillPhone}" placeholder="${t('login_id_placeholder')}" required autocomplete="username">
            </div>
            
            <div class="form-group">
              <label>${t('password_label')} <span style="color:var(--danger)">*</span></label>
              <input type="password" id="login-password" placeholder="${t('password_placeholder')}" required autocomplete="current-password">
            </div>

            <button type="submit" class="btn btn-primary btn-lg" id="login-btn" style="margin-top:6px;">${t('login_btn')}</button>
          </form>

          <div style="text-align: center; margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--border);">
            <span style="font-size:13px;color:var(--text-muted);">${t('new_worker_prompt')}</span>
            <a class="auth-link" style="margin-left:4px;" onclick="renderLoginView('signup')">${t('signup_link')}</a>
          </div>
        ` : `
          <!-- Sign Up Form (New Worker Self-Registration) -->
          <form id="signup-form" onsubmit="handleSignUpSubmit(event)">
            <div class="form-group">
              <label>${t('full_name')} <span style="color:var(--danger)">*</span></label>
              <input type="text" id="signup-name" placeholder="${t('full_name_placeholder')}" required autocomplete="name">
            </div>

            <div class="form-group">
              <label>${t('mobile_number')} <span style="color:var(--danger)">*</span></label>
              <input type="tel" id="signup-phone" pattern="[0-9]{10}" maxlength="10" minlength="10" inputmode="numeric" placeholder="${t('mobile_number')}" required autocomplete="tel">
              <small style="color:var(--text-muted);font-size:11px;">${t('register_note')}</small>
            </div>

            <div class="form-group">
              <label>${t('trade_category')} <span style="color:var(--danger)">*</span></label>
              <select id="signup-trade" onchange="handleDropdownWithCustom(this, 'signup-trade-custom')">
                <option value="">-- Choose Trade Category --</option>
                ${TRADE_TYPES.map(t => `<option value="${t}">${t}</option>`).join('')}
                <option value="__custom__">✏️ Other / Custom Trade (Type below)</option>
              </select>
              <input type="text" id="signup-trade-custom" placeholder="Or type custom Trade / Specialty here..." style="margin-top:6px;">
            </div>

            <div class="form-group">
              <label>Shop Location / Work Area</label>
              <input type="text" id="signup-addr" placeholder="e.g. Rosera, Samastipur" autocomplete="street-address">
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Create Password <span style="color:var(--danger)">*</span></label>
                <input type="password" id="signup-pw" placeholder="Min 4 characters" minlength="4" required autocomplete="new-password">
              </div>
              <div class="form-group">
                <label>Confirm Password <span style="color:var(--danger)">*</span></label>
                <input type="password" id="signup-confirm-pw" placeholder="Re-enter password" minlength="4" required autocomplete="new-password">
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-lg" id="signup-btn" style="margin-top:6px;">Create Account & Sign In</button>
          </form>

          <div style="text-align: center; margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--border);">
            <span style="font-size:13px;color:var(--text-muted);">Already registered?</span>
            <a class="auth-link" style="margin-left:4px;" onclick="renderLoginView('login')">Sign In with Credentials ➔</a>
          </div>
        `}
      </div>
    </div>
  `;
}

// Handle Sign In Submit
async function handleLoginSubmit(e) {
  e.preventDefault();
  const u = document.getElementById('login-username').value.trim();
  const p = document.getElementById('login-password').value;
  const btn = document.getElementById('login-btn');

  btn.disabled = true;
  btn.textContent = 'Authenticating...';

  try {
    const res = await API.post('/api/auth/login', { username: u, password: p });
    AppState.token = res.token;
    AppState.user = res.user;
    localStorage.setItem('mech_audit_token', res.token);
    showToast(`Welcome back, ${res.user.name}!`, 'success');
    startAutoSync();
    navigate(res.user.role === 'auditor' ? 'audit_feed' : 'dash');
  } catch (err) {
    btn.disabled = false;
    btn.textContent = 'Secure Login';
  }
}

// Handle Sign Up Submit
async function handleSignUpSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('signup-name').value.trim();
  const phone = document.getElementById('signup-phone').value.trim();
  const customTrade = document.getElementById('signup-trade-custom') ? document.getElementById('signup-trade-custom').value.trim() : '';
  const selTrade = document.getElementById('signup-trade') ? document.getElementById('signup-trade').value : '';
  const trade_type = customTrade || (selTrade && selTrade !== '__custom__' ? selTrade : 'Others');
  const address = document.getElementById('signup-addr').value.trim();
  const pw = document.getElementById('signup-pw').value;
  const confirmPw = document.getElementById('signup-confirm-pw').value;
  const btn = document.getElementById('signup-btn');

  const cleanPhone = phone.replace(/[^0-9]/g, '');
  if (!cleanPhone || cleanPhone.length !== 10) {
    return showToast('Mobile number is mandatory and must be exactly 10 digits', 'error');
  }

  if (pw !== confirmPw) {
    return showToast('Passwords do not match. Please re-enter.', 'error');
  }

  btn.disabled = true;
  btn.textContent = 'Creating Account...';

  try {
    const res = await API.post('/api/auth/signup', {
      name,
      phone: cleanPhone,
      trade_type,
      address,
      password: pw
    });

    AppState.token = res.token;
    AppState.user = res.user;
    localStorage.setItem('mech_audit_token', res.token);
    showToast(res.message || 'Account created successfully!', 'success');
    startAutoSync();

    if (res.welcomeGreeting) {
      showWorkerWelcomeModal(res.welcomeGreeting, () => {
        navigate('dash');
      });
    } else {
      navigate('dash');
    }
  } catch (err) {
    btn.disabled = false;
    btn.textContent = 'Create Account & Sign In';
  }
}

// Welcome Greeting Modal for newly registered worker (1-Tap WhatsApp Greeting & Onboarding)
function showWorkerWelcomeModal(welcomeData, onProceed) {
  if (!welcomeData) {
    if (onProceed) onProceed();
    return;
  }

  const isWorker = AppState.user && AppState.user.role === 'mechanic';
  const modalRoot = document.getElementById('modal-root');
  
  const workerWhatsAppMsg = `Namaste Mahabir Traders! I have registered as a new worker on your rewards app.\n\n👤 Name: ${welcomeData.workerName}\n🆔 User ID: ${welcomeData.uid}\n📱 Mobile: ${welcomeData.workerPhone}\n🛠️ Trade: ${welcomeData.tradeType || 'Worker'}\n\nPlease connect my account for points alerts & updates.`;
  const workerHelplineUrl = `https://wa.me/919955594571?text=${encodeURIComponent(workerWhatsAppMsg)}`;
  const workerSelfUrl = `https://wa.me/91${welcomeData.workerPhone}?text=${encodeURIComponent(welcomeData.messageText)}`;

  modalRoot.innerHTML = `
    <div class="modal-backdrop" onclick="closeWelcomeModal()">
      <div class="modal-content" style="max-width:540px;text-align:center;" onclick="event.stopPropagation()">
        
        <div style="font-size:44px;margin-bottom:6px;">🎉</div>
        <h2 style="font-size:22px;font-weight:800;color:var(--primary);margin:0 0 6px 0;">
          ${isWorker ? 'Welcome to Mahabir Traders!' : 'Worker Registered Successfully!'}
        </h2>
        <p style="font-size:13.5px;color:var(--text-muted);margin:0 0 14px 0;">
          ${isWorker 
            ? `Your rewards profile is ready. Connect on WhatsApp to get points alerts!` 
            : `Account created for <b>${welcomeData.workerName}</b> (${welcomeData.uid}). Send them their official welcome greeting:`}
        </p>

        <!-- Summary Chip Grid -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:var(--radius-sm);padding:10px 12px;margin-bottom:14px;text-align:left;font-size:12.5px;">
          <div><b>👤 Name:</b> ${welcomeData.workerName}</div>
          <div><b>🆔 User ID:</b> <span style="color:var(--primary);font-weight:700;">${welcomeData.uid}</span></div>
          <div><b>📱 Mobile:</b> +91 ${welcomeData.workerPhone}</div>
          <div><b>🛠️ Trade:</b> ${welcomeData.tradeType || 'Worker'}</div>
        </div>

        <!-- WhatsApp Greeting Card Preview -->
        <div style="text-align:left;margin-bottom:14px;">
          <div style="font-size:11.5px;font-weight:700;color:#15803D;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">
            💬 Official WhatsApp Welcome Message Preview:
          </div>
          <div id="worker-welcome-preview" style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:var(--radius-sm);padding:12px;font-size:12.5px;line-height:1.55;color:#166534;white-space:pre-line;max-height:180px;overflow-y:auto;font-family:inherit;">
${welcomeData.messageText}
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:10px;">
          ${isWorker ? `
            <a href="${workerHelplineUrl}" target="_blank" class="btn btn-primary btn-lg" style="background:#25D366;color:#ffffff;border:none;display:flex;align-items:center;justify-content:center;gap:8px;font-weight:700;font-size:15px;text-decoration:none;" onclick="handleWelcomeWhatsAppClicked()">
              <span>💬</span>
              <span>Connect with Store Helpline on WhatsApp (+91 9955594571)</span>
            </a>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
              <a href="${workerSelfUrl}" target="_blank" class="btn btn-secondary" style="font-size:12.5px;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:6px;" onclick="handleWelcomeWhatsAppClicked()">
                <span>📲</span>
                <span>Send to My WhatsApp</span>
              </a>
              <button type="button" class="btn btn-secondary" style="font-size:12.5px;" onclick="copyWelcomeGreetingText()">
                📋 Copy Details
              </button>
            </div>

            <button type="button" class="btn btn-secondary btn-lg" style="margin-top:4px;" onclick="closeWelcomeModal()">
              Enter My Dashboard ➔
            </button>
          ` : `
            <a href="${welcomeData.whatsappUrl}" target="_blank" class="btn btn-primary btn-lg" style="background:#25D366;color:#ffffff;border:none;display:flex;align-items:center;justify-content:center;gap:8px;font-weight:700;font-size:15px;text-decoration:none;" onclick="handleWelcomeWhatsAppClicked()">
              <span>💬</span>
              <span>Send Welcome Greeting to Worker (+91 ${welcomeData.workerPhone})</span>
            </a>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
              <a href="${welcomeData.smsUrl}" class="btn btn-secondary" style="font-size:12.5px;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:6px;">
                <span>📨</span>
                <span>Send via SMS</span>
              </a>
              <button type="button" class="btn btn-secondary" style="font-size:12.5px;" onclick="copyWelcomeGreetingText()">
                📋 Copy Message Text
              </button>
            </div>

            <button type="button" class="btn btn-secondary btn-lg" style="margin-top:4px;" onclick="closeWelcomeModal()">
              Done / Back to Directory ➔
            </button>
          `}
        </div>

      </div>
    </div>
  `;

  window._welcomeModalCallback = onProceed;
}

function handleWelcomeWhatsAppClicked() {
  showToast('Opening WhatsApp with greeting...', 'info');
}

function copyWelcomeGreetingText() {
  const el = document.getElementById('worker-welcome-preview');
  if (!el) return;
  navigator.clipboard.writeText(el.innerText).then(() => {
    showToast('Welcome message copied to clipboard!', 'success');
  }).catch(() => {
    showToast('Failed to copy', 'error');
  });
}

function sendWorkerWelcomeGreetingPrompt(name, uid, phone, tradeType) {
  const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
  const text = `🏪 *MAHABIR TRADERS - WELCOME ABOARD!* 🏪\n\n` +
    `Namaste *${name}*,\n` +
    `Welcome to the *Mahabir Traders* Mechanic & Worker Loyalty Rewards Program!\n\n` +
    `👤 *Your User ID:* ${uid}\n` +
    `📱 *Registered Mobile:* ${cleanPhone}\n` +
    `🛠️ *Trade Category:* ${tradeType || 'Worker'}\n` +
    `🎁 *Starting Balance:* 0 Points\n\n` +
    `Submit customer purchase bills whenever you buy or refer materials from Mahabir Traders to earn instant reward points and claim exciting gifts!\n\n` +
    `📍 *Store Location:* Block Road, Rosera, Samastipur\n` +
    `📞 *Helpline / Orders:* +91 9955594571 / 8949492740\n\n` +
    `Thank you for partnering with Mahabir Traders!`;

  showWorkerWelcomeModal({
    workerName: name,
    workerPhone: cleanPhone,
    uid: uid,
    tradeType: tradeType || 'Worker',
    whatsappUrl: `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(text)}`,
    smsUrl: `sms:+91${cleanPhone}?body=${encodeURIComponent(text)}`,
    messageText: text
  });
}

function closeWelcomeModal() {
  closeModal();
  if (window._welcomeModalCallback) {
    const cb = window._welcomeModalCallback;
    window._welcomeModalCallback = null;
    cb();
  }
}

// Modal: Forgot Password / Reset via Mobile OTP
let resetOtpState = {
  phone: '',
  otp: '',
  expiresAt: null
};

function openForgotPasswordModal(initialPhone = '') {
  const cleanInitialPhone = (initialPhone || '').replace(/[^0-9]/g, '');
  const modalRoot = document.getElementById('modal-root');
  
  modalRoot.innerHTML = `
    <div class="modal-backdrop" onclick="closeModal()">
      <div class="modal-content" style="max-width:480px;" onclick="event.stopPropagation()">
        <div class="modal-header">
          <div class="card-title">🔑 Reset Password via Mobile OTP</div>
          <button class="modal-close" onclick="closeModal()">✕</button>
        </div>

        <div id="forgot-pw-step-1">
          <p style="font-size:13px;color:var(--text-muted);margin-bottom:14px;">
            Enter your registered 10-digit mobile number. We will send a secure 6-digit OTP to verify your identity.
          </p>
          <form onsubmit="handleSendOtpSubmit(event)">
            <div class="form-group">
              <label>Registered 10-Digit Mobile Number <span style="color:var(--danger)">*</span></label>
              <input type="tel" id="reset-phone-input" pattern="[0-9]{10}" maxlength="10" minlength="10" inputmode="numeric" value="${cleanInitialPhone}" placeholder="10-digit mobile number" required autofocus>
            </div>
            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px;">
              <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
              <button type="submit" class="btn btn-primary" id="send-otp-btn">📨 Send Verification OTP</button>
            </div>
          </form>
        </div>

        <div id="forgot-pw-step-2" style="display:none;">
          <!-- Populated after OTP is generated -->
        </div>
      </div>
    </div>
  `;
}

// Send OTP
async function handleSendOtpSubmit(e) {
  e.preventDefault();
  const phoneInput = document.getElementById('reset-phone-input');
  const phone = phoneInput ? phoneInput.value.trim() : '';
  const btn = document.getElementById('send-otp-btn');

  const cleanPhone = phone.replace(/[^0-9]/g, '');
  if (!cleanPhone || cleanPhone.length !== 10) {
    return showToast('Mobile number is mandatory and must be exactly 10 digits', 'error');
  }

  btn.disabled = true;
  btn.textContent = 'Sending OTP...';

  try {
    const res = await API.post('/api/auth/forgot-password/send-otp', { phone });
    resetOtpState = {
      phone: res.phone,
      otp: res.otp,
      expiresAt: res.expiresAt
    };

    showToast(res.message, 'success');
    renderOtpVerifyStep(res);
  } catch (err) {
    btn.disabled = false;
    btn.textContent = '📨 Send Verification OTP';
  }
}

// Render Step 2: OTP Verification & New Password
function renderOtpVerifyStep(resData) {
  const step1 = document.getElementById('forgot-pw-step-1');
  const step2 = document.getElementById('forgot-pw-step-2');
  if (step1) step1.style.display = 'none';
  if (!step2) return;

  step2.style.display = 'block';
  step2.innerHTML = `
    <div style="background:#EFF6FF;border:1px solid #BFDBFE;padding:12px;border-radius:var(--radius-sm);margin-bottom:14px;">
      <div style="font-size:13px;font-weight:700;color:#1E40AF;">✓ OTP Sent to +91 ${resData.phone}</div>
      <div style="font-size:12px;color:#1E40AF;margin-top:2px;">
        Account: <b>${resData.userName}</b>. Valid for 10 minutes.
      </div>
    </div>

    <!-- Live OTP Display Box for Instant Testing & Mobile WhatsApp link -->
    <div class="otp-box">
      <div style="font-size:11px;color:#166534;font-weight:600;text-transform:uppercase;">Your 6-Digit OTP Code</div>
      <div class="otp-display-val" id="display-otp">${resData.otp}</div>
      <div style="display:flex;justify-content:center;gap:8px;margin-top:6px;flex-wrap:wrap;">
        <button type="button" class="btn btn-success btn-sm" onclick="autoFillOtp('${resData.otp}')">⚡ Auto-Fill OTP</button>
        <a href="${resData.whatsappUrl}" target="_blank" class="btn btn-secondary btn-sm" style="background:#DCFCE7;color:#166534;">💬 Open WhatsApp</a>
      </div>
    </div>

    <form onsubmit="handleVerifyOtpSubmit(event)">
      <div class="form-group">
        <label>Enter 6-Digit OTP Code <span style="color:var(--danger)">*</span></label>
        <input type="text" id="verify-otp-input" pattern="[0-9]{6}" maxlength="6" placeholder="e.g. 123456" required style="font-size:18px;letter-spacing:4px;text-align:center;font-weight:700;">
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>New Password <span style="color:var(--danger)">*</span></label>
          <input type="password" id="new-password-input" minlength="4" placeholder="Min 4 chars" required autocomplete="new-password">
        </div>
        <div class="form-group">
          <label>Confirm Password <span style="color:var(--danger)">*</span></label>
          <input type="password" id="confirm-new-password-input" minlength="4" placeholder="Re-enter password" required autocomplete="new-password">
        </div>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;flex-wrap:wrap;gap:8px;">
        <button type="button" class="btn btn-secondary btn-sm" onclick="openForgotPasswordModal('${resData.phone}')">← Resend OTP</button>
        <button type="submit" class="btn btn-primary" id="reset-submit-btn">🔐 Set New Password</button>
      </div>
    </form>
  `;
}

function autoFillOtp(otp) {
  const input = document.getElementById('verify-otp-input');
  if (input) {
    input.value = otp;
    showToast('OTP auto-filled!', 'info');
  }
}

// Verify OTP and Complete Password Reset
async function handleVerifyOtpSubmit(e) {
  e.preventDefault();
  const otpInput = document.getElementById('verify-otp-input');
  const newPwInput = document.getElementById('new-password-input');
  const confirmPwInput = document.getElementById('confirm-new-password-input');
  const btn = document.getElementById('reset-submit-btn');

  const otp = otpInput ? otpInput.value.trim() : '';
  const newPassword = newPwInput ? newPwInput.value : '';
  const confirmPassword = confirmPwInput ? confirmPwInput.value : '';

  if (newPassword !== confirmPassword) {
    return showToast('New passwords do not match. Please re-enter.', 'error');
  }

  btn.disabled = true;
  btn.textContent = 'Updating Password...';

  try {
    const res = await API.post('/api/auth/forgot-password/verify-otp', {
      phone: resetOtpState.phone,
      otp,
      newPassword
    });

    showToast(res.message || 'Password reset successfully!', 'success');
    closeModal();
    renderLoginView('login', resetOtpState.phone);
  } catch (err) {
    btn.disabled = false;
    btn.textContent = '🔐 Set New Password';
  }
}

async function logout(callApi = true) {
  if (callApi && AppState.token) {
    try { await API.post('/api/auth/logout', {}); } catch (e) {}
  }
  AppState.token = null;
  AppState.user = null;
  localStorage.removeItem('mech_audit_token');
  if (AppState.pollTimer) clearInterval(AppState.pollTimer);
  renderLoginView('login');
  showToast('Logged out successfully', 'info');
}

/* =========================================================================
   ABOUT SYSTEM VIEW & SHOWCASE LIGHTBOX
   ========================================================================= */

function openShowcaseLightbox(imgSrc = '/images/mahabir_about_showcase.png') {
  let modal = document.getElementById('about-lightbox-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'about-lightbox-modal';
    modal.className = 'lightbox-modal';
    modal.onclick = (e) => {
      if (e.target === modal || e.target.classList.contains('lightbox-close')) {
        closeShowcaseLightbox();
      }
    };
    document.body.appendChild(modal);
  }
  modal.innerHTML = `
    <div class="lightbox-content" onclick="event.stopPropagation()">
      <button class="lightbox-close" onclick="closeShowcaseLightbox()" title="Close Fullscreen">✕</button>
      <img src="${imgSrc}" class="lightbox-img" alt="Mahabir Traders Showroom Walkthrough & Store Catalog" />
    </div>
  `;
  modal.style.display = 'flex';
}

function closeShowcaseLightbox() {
  const modal = document.getElementById('about-lightbox-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function copyGstinToClipboard(gstin = '10AHBPK0437M1ZF') {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(gstin).then(() => {
      showToast(`GSTIN copied to clipboard: ${gstin}`, 'success');
    }).catch(() => {
      prompt('Copy GSTIN:', gstin);
    });
  } else {
    prompt('Copy GSTIN:', gstin);
  }
}

async function renderAboutView() {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="top-bar">
      <div>
        <h1 class="page-title">🏪 ${t('about_title')}</h1>
        <p style="font-size:13px;color:var(--text-muted)">${t('about_subtitle')}</p>
      </div>
      <div class="top-actions">
        <a href="tel:+919955594571" class="btn btn-primary btn-sm">📞 ${t('call_rajesh')}</a>
        <a href="https://wa.me/919955594571?text=Hello%20Rajesh%20Ji%2C%20I%20am%20contacting%20you%20from%20Mahabir%20Traders%20App" target="_blank" class="btn btn-secondary btn-sm" style="background:#25D366;color:#ffffff;border:none;">💬 ${t('whatsapp_rajesh')}</a>
      </div>
    </div>

    <div class="about-single-column">
      
      <!-- 1. Store Identity & Storefront Photo Card -->
      <div class="card" style="padding:22px;">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:14px;">
          <div>
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:28px;">🏪</span>
              <h2 style="font-size:22px;font-weight:800;color:var(--primary);margin:0;">${t('brand_name')}</h2>
            </div>
            <div style="font-size:14px;font-weight:700;color:#0284C7;margin-top:2px;">${t('brand_name')} · Rosera / Block Road</div>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            <span class="badge" style="background:#FEF3C7;color:#92400E;border:1px solid #FDE68A;font-weight:700;">${t('trusted_badge')}</span>
            <span class="badge" style="background:#E0E7FF;color:#3730A3;border:1px solid #C7D2FE;font-weight:700;">${t('authorized_hub_badge')}</span>
          </div>
        </div>

        <h3 style="font-size:17px;font-weight:800;color:#0F172A;line-height:1.3;margin:0 0 6px 0;">
          ${t('foundations_headline')}
        </h3>
        <p style="font-size:14px;line-height:1.6;color:var(--text-muted);margin:0 0 16px 0;">
          ${t('foundations_desc')}
        </p>

        <!-- Storefront Photo Banner -->
        <div class="storefront-banner-card" onclick="openShowcaseLightbox('/images/storefront.jpg')">
          <img src="/images/storefront.jpg" alt="Mahabir Traders Storefront Rosera Block Road" class="storefront-banner-img" />
          <div class="storefront-banner-overlay">
            <div>
              <div style="font-size:16px;font-weight:800;color:#ffffff;text-shadow:0 1px 4px rgba(0,0,0,0.8);">${t('brand_name')}</div>
              <div style="font-size:12px;color:#E2E8F0;text-shadow:0 1px 3px rgba(0,0,0,0.8);">Block Road, Rosera</div>
            </div>
            <span style="padding:4px 10px;border-radius:4px;background:#C2410C;color:#ffffff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">
              ${t('authorized_hub_badge')}
            </span>
          </div>
        </div>

        <!-- GST Bar -->
        <div style="display:flex;align-items:center;justify-content:space-between;background:#F1F5F9;padding:12px 14px;border-radius:var(--radius-sm);border:1px solid var(--border);flex-wrap:wrap;gap:8px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:18px;">🧾</span>
            <span style="font-size:13px;font-weight:700;color:#334155;">GSTIN:</span>
            <code style="font-size:14px;font-weight:800;color:#0F172A;letter-spacing:0.5px;">10AHBPK0437M1ZF</code>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="copyGstinToClipboard('10AHBPK0437M1ZF')" style="padding:4px 12px;font-size:12px;">
            ${t('copy_gstin')}
          </button>
        </div>
      </div>

      <!-- 2. Leadership & Contact Details -->
      <div class="card" style="padding:22px;">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
          <div style="width:50px;height:50px;border-radius:50%;background:#0B132B;color:#38BDF8;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;flex-shrink:0;">
            👤
          </div>
          <div>
            <div style="font-size:11px;font-weight:700;color:#D97706;text-transform:uppercase;letter-spacing:0.5px;">${t('leadership_title')}</div>
            <h3 style="font-size:19px;font-weight:800;color:#0F172A;margin:2px 0 0 0;">${t('proprietor_name')}</h3>
            <div style="font-size:13px;color:var(--text-muted);">${t('proprietor_role')}</div>
          </div>
        </div>

        <!-- Proprietor Quote Box -->
        <div style="background:#EFF6FF;border-left:4px solid #3B82F6;padding:14px 16px;border-radius:4px;margin-bottom:16px;">
          <div style="font-size:11px;font-weight:700;color:#1D4ED8;text-transform:uppercase;margin-bottom:4px;">💬 ${t('proprietors_message_title')}</div>
          <p style="font-size:13.5px;font-style:italic;color:#1E3A8A;margin:0;line-height:1.5;">
            ${t('proprietors_message')}
          </p>
        </div>

        <!-- Action Contact Grid -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
          <a href="tel:+919955594571" class="btn btn-primary" style="display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none;padding:11px 14px;font-size:13.5px;">
            <span>📞</span>
            <span>${t('call_rajesh')}</span>
          </a>
          <a href="https://wa.me/919955594571?text=Hello%20Rajesh%20Ji%2C%20I%20am%20contacting%20you%20from%20Mahabir%20Traders%20App" target="_blank" class="btn btn-secondary" style="display:flex;align-items:center;justify-content:center;gap:8px;background:#25D366;color:#ffffff;border:none;text-decoration:none;padding:11px 14px;font-size:13.5px;">
            <span>💬</span>
            <span>${t('whatsapp_rajesh')}</span>
          </a>
        </div>

        <!-- Store Location -->
        <div style="display:flex;align-items:flex-start;gap:10px;background:#F8FAFC;padding:12px 14px;border-radius:var(--radius-sm);border:1px solid var(--border);">
          <span style="font-size:20px;margin-top:2px;">📍</span>
          <div style="flex:1;">
            <div style="font-size:12px;font-weight:700;color:#475569;">${t('store_location_label')}</div>
            <div style="font-size:13.5px;font-weight:600;color:#0F172A;margin-top:2px;">${t('store_location_val')}</div>
          </div>
          <a href="https://maps.google.com/?q=Mahabir+Traders+Block+Road+Rosera+Samastipur+Bihar+848210" target="_blank" class="btn btn-secondary btn-sm" style="padding:5px 10px;font-size:11.5px;flex-shrink:0;">
            🗺️ ${t('map_btn')}
          </a>
        </div>
      </div>

      <!-- 3. Showroom Display & Studio Walkthrough (3 Zones with High-Res Images) -->
      <div class="card" style="padding:22px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:8px;">
          <div>
            <div style="font-size:11px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.5px;">${t('walkthrough_title')}</div>
            <h3 style="font-size:19px;font-weight:800;color:#0F172A;margin:2px 0 0 0;">${t('walkthrough_title')}</h3>
          </div>
          <span class="badge" style="background:#EFF6FF;color:#1D4ED8;border:1px solid #BFDBFE;font-weight:700;">${t('experience_zones')}</span>
        </div>

        <!-- Zone 01: Wash Basins & Vanities -->
        <div class="experience-zone-card">
          <div class="zone-badge">🚿 ${t('zone1_title')}</div>
          <div class="zone-img-wrap" onclick="openShowcaseLightbox('/images/zone1_vanity.jpg')">
            <img src="/images/zone1_vanity.jpg" alt="${t('zone1_name')}" class="zone-img" />
          </div>
          <h4 style="font-size:15px;font-weight:700;color:#0F172A;margin:0 0 4px 0;">${t('zone1_name')}</h4>
          <p style="font-size:13px;color:var(--text-muted);margin:0;line-height:1.5;">
            ${t('zone1_desc')}
          </p>
        </div>

        <!-- Zone 02: Luxury Tiles & Glazed Vitrified Display -->
        <div class="experience-zone-card" style="border-left-color:#F59E0B;">
          <div class="zone-badge" style="background:#FEF3C7;color:#92400E;">🧱 ${t('zone2_title')}</div>
          <div class="zone-img-wrap" onclick="openShowcaseLightbox('/images/zone2_tiles.jpg')">
            <img src="/images/zone2_tiles.jpg" alt="${t('zone2_name')}" class="zone-img" />
          </div>
          <h4 style="font-size:15px;font-weight:700;color:#0F172A;margin:0 0 4px 0;">${t('zone2_name')}</h4>
          <p style="font-size:13px;color:var(--text-muted);margin:0;line-height:1.5;">
            ${t('zone2_desc')}
          </p>
        </div>

        <!-- Zone 03: Modern Sanitary Studio -->
        <div class="experience-zone-card" style="border-left-color:#10B981;">
          <div class="zone-badge" style="background:#D1FAE5;color:#065F46;">🚽 ${t('zone3_title')}</div>
          <div class="zone-img-wrap" onclick="openShowcaseLightbox('/images/zone3_sanitary.jpg')">
            <img src="/images/zone3_sanitary.jpg" alt="${t('zone3_name')}" class="zone-img" />
          </div>
          <h4 style="font-size:15px;font-weight:700;color:#0F172A;margin:0 0 4px 0;">${t('zone3_name')}</h4>
          <p style="font-size:13px;color:var(--text-muted);margin:0;line-height:1.5;">
            ${t('zone3_desc')}
          </p>
        </div>

        <!-- Trust Pillars Grid -->
        <div class="trust-pillar-grid">
          <div class="trust-pillar-item">
            <div style="font-size:22px;margin-bottom:4px;">🛡️</div>
            <div style="font-size:13px;font-weight:700;color:#0F172A;">${t('trust_genuine')}</div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">${t('trust_genuine_sub')}</div>
          </div>
          <div class="trust-pillar-item">
            <div style="font-size:22px;margin-bottom:4px;">🚚</div>
            <div style="font-size:13px;font-weight:700;color:#0F172A;">${t('trust_dispatch')}</div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">${t('trust_dispatch_sub')}</div>
          </div>
          <div class="trust-pillar-item">
            <div style="font-size:22px;margin-bottom:4px;">🧾</div>
            <div style="font-size:13px;font-weight:700;color:#0F172A;">${t('trust_gst')}</div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">${t('trust_gst_sub')}</div>
          </div>
        </div>
      </div>

      <!-- 4. System Platform Information -->
      <div class="card" style="padding:16px;background:#F8FAFC;border:1px solid var(--border);">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;font-size:12.5px;color:var(--text-muted);">
          <div><b>${t('version')}:</b> 1.0.0 (Multi-Device PWA)</div>
          <div><b>${t('brand_name')}:</b> ${t('brand_tagline')}</div>
        </div>
      </div>

    </div>
  `;
}

/* =========================================================================
   ADMIN DASHBOARD VIEW
   ========================================================================= */

async function renderAdminDashboard() {
  const main = document.getElementById('main-content');
  const stats = await API.get('/api/dashboard/stats');
  AppState.stats = stats;

  main.innerHTML = `
    <div class="top-bar">
      <div>
        <h1 class="page-title">${t('admin_dash_title')}</h1>
        <p style="font-size:13px;color:var(--text-muted)">${t('admin_dash_subtitle')}</p>
      </div>
      <div class="top-actions">
        <button class="btn btn-secondary btn-sm" onclick="navigate('verifications')">${t('verify_bills_btn')} (${stats.pendingBills})</button>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card interactive" onclick="navigate('mechanics')">
        <div class="stat-label">${t('stat_total_mechanics')}</div>
        <div class="stat-value">${stats.totalMechanics}</div>
        <span style="font-size:11px;color:var(--success)">${stats.activeMechanics} ${t('stat_active_in_field')}</span>
      </div>

      <div class="stat-card interactive highlight" onclick="navigate('verifications')">
        <div class="stat-label">${t('stat_pending_verification')}</div>
        <div class="stat-value" style="color:var(--warning)">${stats.pendingBills}</div>
        <span style="font-size:11px;color:var(--text-muted)">${t('stat_requires_action')}</span>
      </div>

      <div class="stat-card">
        <div class="stat-label">${t('stat_approved_purchases')}</div>
        <div class="stat-value" style="color:var(--success)">${stats.approvedBills}</div>
        <span style="font-size:11px;color:var(--text-muted)">${formatINR(stats.purchaseValue)} ${t('stat_total_value')}</span>
      </div>

      <div class="stat-card">
        <div class="stat-label">${t('stat_points_issued')}</div>
        <div class="stat-value">${stats.pointsIssued.toLocaleString()}</div>
        <span style="font-size:11px;color:var(--text-muted)">${stats.pointsRedeemed.toLocaleString()} ${t('stat_points_redeemed')}</span>
      </div>

      <div class="stat-card interactive" onclick="navigate('redemptions')">
        <div class="stat-label">${t('stat_pending_claims')}</div>
        <div class="stat-value" style="color:${stats.pendingRedemptions > 0 ? 'var(--warning)' : 'var(--primary)'}">${stats.pendingRedemptions}</div>
        <span style="font-size:11px;color:var(--text-muted)">${t('stat_reward_redemptions')}</span>
      </div>

      <div class="stat-card interactive" onclick="navigate('returns')">
        <div class="stat-label">${t('stat_product_returns')}</div>
        <div class="stat-value">${stats.returnsCount}</div>
        <span style="font-size:11px;color:var(--danger)">${stats.pointsReversed} ${t('stat_pts_reversed')}</span>
      </div>
    </div>

    <div class="grid-2col" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;width:100%;">
      <div class="card">
        <div class="card-header">
          <div class="card-title">${t('chart_trade_breakdown')}</div>
        </div>
        <div style="position:relative;height:240px;">
          <canvas id="trade-chart"></canvas>
        </div>
      </div>

      <div class="card" style="padding:0;overflow:hidden;">
        <div class="card-header" style="padding:16px 16px 12px 16px;margin-bottom:0;border-bottom:1px solid var(--border);">
          <div>
            <div class="card-title">${t('field_cat_performance')}</div>
            <small style="color:var(--text-muted)">${t('field_cat_subtitle')}</small>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="navigate('reports')">${t('full_report_btn')}</button>
        </div>
        <div class="table-responsive" style="border:none;border-radius:0;margin-bottom:0;">
          <table>
            <thead>
              <tr>
                <th>${t('th_trade_type')}</th>
                <th>${t('th_workers')}</th>
                <th>${t('th_approved_sales')}</th>
                <th>${t('th_pending_bills')}</th>
              </tr>
            </thead>
            <tbody>
              ${(stats.tradeBreakdown || []).map(t => `
                <tr style="cursor:pointer;" onclick="navigate('category_workers', '${t.type}')" title="Click to view all ${t.type} workers">
                  <td><b style="color:var(--accent);">${t.type}</b> <span style="font-size:12px;color:var(--accent);">➔</span></td>
                  <td><b>${t.mechanics_count}</b></td>
                  <td>${formatINR(t.approved_value)}</td>
                  <td>${t.pending_bills > 0 ? `<span class="badge badge-pending">${t.pending_bills} pending</span>` : '<span style="color:var(--text-muted)">0</span>'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  // Render Chart.js
  if (window.Chart && document.getElementById('trade-chart')) {
    const ctx = document.getElementById('trade-chart').getContext('2d');
    const labels = (stats.tradeBreakdown || []).map(t => t.type);
    const data = (stats.tradeBreakdown || []).map(t => t.approved_value);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Approved Sales (₹)',
          data: data,
          backgroundColor: '#2563EB',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              footer: () => '👉 Click bar to view category workers'
            }
          }
        },
        onClick: (event, elements) => {
          if (elements && elements.length > 0) {
            const index = elements[0].index;
            const selectedCategory = labels[index];
            if (selectedCategory) {
              navigate('category_workers', selectedCategory);
            }
          }
        },
        onHover: (event, chartElement) => {
          event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
        },
        scales: {
          y: { beginAtZero: true, ticks: { callback: v => '₹' + v.toLocaleString() } }
        }
      }
    });
  }
}

/* =========================================================================
   AUDITOR / FIELD AUDIT QUEUE VIEW (MOBILE-OPTIMIZED)
   ========================================================================= */

async function renderBillVerifications() {
  const main = document.getElementById('main-content');
  const res = await API.get('/api/purchases?status=PENDING');
  const purchases = res.purchases || [];

  main.innerHTML = `
    <div class="top-bar">
      <div>
        <h1 class="page-title">${t('audit_queue_title')}</h1>
        <p style="font-size:13px;color:var(--text-muted)">${t('audit_queue_sub')}</p>
      </div>
      <div class="top-actions">
        <button class="btn btn-secondary btn-sm" onclick="renderBillVerifications()">🔄 ${t('refresh')} (${purchases.length})</button>
        <button class="btn btn-primary btn-sm" onclick="navigate('submit_purchase')">${t('snap_new_bill')}</button>
      </div>
    </div>

    ${purchases.length === 0 ? `
      <div class="card" style="text-align:center;padding:48px 16px;">
        <div style="font-size:48px;margin-bottom:8px;">✅</div>
        <h3>${t('all_caught_up')}</h3>
        <p style="color:var(--text-muted);margin-top:4px;">${t('no_pending_bills')}</p>
      </div>
    ` : `
      <div style="display:flex;flex-direction:column;gap:12px;">
        ${purchases.map(p => `
          <div class="audit-card">
            <div class="audit-card-header">
              <div>
                <div class="audit-customer">${t('bill_receipt')} #${p.id} — ${p.customer_name}</div>
                <div class="audit-meta">
                  <b>${t('role_mechanic')}:</b> ${p.mechanic_name} (${p.trade_type} · ${p.mechanic_uid}) · <b>${t('phone')}:</b> ${p.mechanic_phone}
                </div>
                <div class="audit-meta">
                  <b>${t('date')}:</b> ${p.purchase_date} · <b>${t('amount')}:</b> <span style="font-size:15px;font-weight:700;color:var(--primary);">${formatINR(p.total_amount)}</span>
                </div>
              </div>
              <span class="badge badge-pending">${t('pending')}</span>
            </div>

            <div style="background:#F8FAFC;padding:10px 12px;border-radius:var(--radius-sm);margin:8px 0;font-size:13px;">
              <b>${t('address')}:</b> ${p.customer_address}<br>
              <b>${t('items')}:</b> ${(p.items || []).map(i => `${i.product_name} (${i.quantity} ${i.unit})`).join(', ') || 'General purchase'}
            </div>

            <div class="audit-quick-actions">
              <a href="tel:${p.customer_phone}" class="audit-btn-call">📞 ${t('call_customer')} (${p.customer_phone})</a>
              <a href="https://wa.me/91${p.customer_phone}?text=${encodeURIComponent(`Hello ${p.customer_name}, verifying your purchase of ${formatINR(p.total_amount)} on ${p.purchase_date}.`)}" target="_blank" class="audit-btn-whatsapp">💬 ${t('whatsapp')}</a>
              ${p.bill_file_url ? `<button class="btn btn-secondary btn-sm" onclick="openBillViewerModal('${p.bill_file_url}', ${p.id})">🖼️ ${t('view_bill_photo')}</button>` : `<span style="font-size:12px;color:var(--danger)">No Bill Photo Attached</span>`}
            </div>

            <div style="display:flex;gap:8px;margin-top:14px;padding-top:12px;border-top:1px solid var(--border);flex-wrap:wrap;">
              <button class="btn btn-success" onclick="openAuditActionModal(${p.id}, 'APPROVE', ${p.total_amount})">${t('approve_credit_pts')}</button>
              <button class="btn btn-danger btn-sm" onclick="openAuditActionModal(${p.id}, 'REJECT')">${t('reject_bill')}</button>
              <button class="btn btn-warning btn-sm" onclick="openAuditActionModal(${p.id}, 'CORRECTION')">${t('request_correction')}</button>
            </div>
          </div>
        `).join('')}
      </div>
    `}
  `;
}

// Modal: Bill Viewer with Zoom
function openBillViewerModal(fileUrl, billId) {
  const modalRoot = document.getElementById('modal-root');
  modalRoot.innerHTML = `
    <div class="modal-backdrop" onclick="closeModal()">
      <div class="modal-content" onclick="event.stopPropagation()">
        <div class="modal-header">
          <div class="card-title">${t('bill_receipt')} #${billId}</div>
          <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <div class="bill-preview-box">
          ${fileUrl.toLowerCase().endsWith('.pdf') ? `
            <a href="${fileUrl}" target="_blank" class="btn btn-primary">📄 Open Full PDF Document</a>
          ` : `
            <img src="${fileUrl}" class="bill-img" id="modal-bill-img" alt="Bill Photo">
          `}
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:12px;">
          <a href="${fileUrl}" target="_blank" class="btn btn-secondary btn-sm">Open in New Tab</a>
          <button class="btn btn-primary btn-sm" onclick="closeModal()">${t('close')}</button>
        </div>
      </div>
    </div>
  `;
}

// Modal: Audit Action (Approve with Points / Reject / Correction)
function openAuditActionModal(purchaseId, action, totalAmount = 0) {
  const modalRoot = document.getElementById('modal-root');
  const defaultPoints = Math.round((totalAmount * 3) / 100); // Default 3 pts per ₹100

  let bodyHtml = '';
  if (action === 'APPROVE') {
    bodyHtml = `
      <div class="form-group">
        <label>${t('points_to_award')} (Calculated from ₹${totalAmount.toLocaleString('en-IN')})</label>
        <input type="number" id="audit-points" value="${defaultPoints}" min="0">
        <small style="color:var(--text-muted)">Standard rate: 3 points per ₹100 spent</small>
      </div>
      <div style="background:#DCFCE7;padding:10px;border-radius:var(--radius-sm);font-size:12px;color:#166534;margin-bottom:12px;">
        ✓ Customer purchase verified<br>
        ✓ Points will be credited directly to the mechanic's active ledger
      </div>
    `;
  } else if (action === 'REJECT') {
    bodyHtml = `
      <div class="form-group">
        <label>${t('rejection_reason')} (Required for Audit Trail)</label>
        <select id="audit-reason-select" onchange="handleDropdownWithCustom(this, 'audit-reason-custom')">
          <option value="">-- Choose Rejection Reason --</option>
          <option value="Bill receipt unreadable / blurry photo">Bill receipt unreadable / blurry photo</option>
          <option value="Customer denied making this purchase">Customer denied making this purchase</option>
          <option value="Duplicate bill already processed">Duplicate bill already processed</option>
          <option value="Invalid / non-registered store bill">Invalid / non-registered store bill</option>
          <option value="Wrong product category billed">Wrong product category billed</option>
          <option value="__custom__">✏️ Other Custom Reason (Type below)</option>
        </select>
        <input type="text" id="audit-reason-custom" placeholder="Or type custom rejection reason here..." style="margin-top:6px;">
      </div>
    `;
  } else if (action === 'CORRECTION') {
    bodyHtml = `
      <div class="form-group">
        <label>${t('correction_msg')}</label>
        <textarea id="audit-correction-msg" rows="3" placeholder="e.g. Please re-upload a clearer photo showing the customer phone number and date..."></textarea>
      </div>
    `;
  }

  modalRoot.innerHTML = `
    <div class="modal-backdrop" onclick="closeModal()">
      <div class="modal-content" onclick="event.stopPropagation()">
        <div class="modal-header">
          <div class="card-title">${action === 'APPROVE' ? t('approve_credit_pts') : action === 'REJECT' ? t('reject_bill') : t('request_correction')}</div>
          <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        ${bodyHtml}
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px;">
          <button class="btn btn-secondary" onclick="closeModal()">${t('cancel')}</button>
          <button class="btn ${action === 'APPROVE' ? 'btn-success' : action === 'REJECT' ? 'btn-danger' : 'btn-warning'}" onclick="submitAuditAction(${purchaseId}, '${action}')">Confirm ${action}</button>
        </div>
      </div>
    </div>
  `;
}

async function submitAuditAction(purchaseId, action) {
  try {
    let payload = { action };
    if (action === 'APPROVE') {
      const pts = parseInt(document.getElementById('audit-points').value, 10);
      if (isNaN(pts) || pts < 0) return showToast('Enter a valid points number', 'error');
      payload.points = pts;
    } else if (action === 'REJECT') {
      const sel = document.getElementById('audit-reason-select') ? document.getElementById('audit-reason-select').value : '';
      const custom = document.getElementById('audit-reason-custom') ? document.getElementById('audit-reason-custom').value.trim() : '';
      payload.reason = custom || (sel && sel !== '__custom__' ? sel : '');
      if (!payload.reason) return showToast('Rejection reason is required', 'error');
    } else if (action === 'CORRECTION') {
      const msg = document.getElementById('audit-correction-msg').value.trim();
      if (!msg) return showToast('Correction message is required', 'error');
      payload.message = msg;
    }

    const res = await API.post(`/api/purchases/${purchaseId}/verify`, payload);
    showToast(`Audit decision recorded: ${action}`, 'success');
    closeModal();

    if (action === 'APPROVE' && res.notification) {
      showWorkerNotificationModal(res.notification, () => {
        renderBillVerifications();
      });
    } else {
      renderBillVerifications();
    }
  } catch (err) {
    // Handled by apiFetch
  }
}

function showWorkerNotificationModal(notif, onClosed = null) {
  if (!notif) return;
  const modalRoot = document.getElementById('modal-root');
  modalRoot.innerHTML = `
    <div class="modal-backdrop" onclick="closeModal(); if(typeof window._notifOnClose === 'function') window._notifOnClose();">
      <div class="modal-content" style="max-width:520px;" onclick="event.stopPropagation()">
        <div class="modal-header">
          <div class="card-title">📲 Send Alert to ${notif.workerName}</div>
          <button class="modal-close" onclick="closeModal(); if(typeof window._notifOnClose === 'function') window._notifOnClose();">✕</button>
        </div>

        <div style="background:#F0FDF4;border:1px solid #BBF7D0;padding:12px;border-radius:var(--radius-sm);margin-bottom:14px;">
          <div style="font-size:13px;font-weight:700;color:#166534;">✓ Bill Processed & Points Awarded!</div>
          <div style="font-size:12px;color:#166534;margin-top:2px;">
            Send an instant WhatsApp or Text SMS to <b>${notif.workerName}</b> (${notif.workerPhone}) with customer and points details.
          </div>
        </div>

        <div class="form-group">
          <label>Automated WhatsApp / SMS Message Preview</label>
          <div id="worker-notif-preview" style="background:#0F172A;color:#F8FAFC;padding:12px;border-radius:var(--radius-sm);font-family:monospace;font-size:12px;white-space:pre-wrap;max-height:200px;overflow-y:auto;border:1px solid #334155;line-height:1.4;">${notif.messageText}</div>
        </div>

        <div style="display:flex;flex-direction:column;gap:8px;margin-top:16px;">
          <a href="${notif.whatsappUrl}" target="_blank" class="btn btn-success btn-lg" style="text-decoration:none;">
            💬 Open WhatsApp & Send to ${notif.workerName}
          </a>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            <a href="${notif.smsUrl}" class="btn btn-secondary" style="text-decoration:none;">📱 Send as Text SMS</a>
            <button class="btn btn-secondary" onclick="copyNotifText()">📋 Copy Text</button>
          </div>
          <button class="btn btn-secondary btn-sm" style="margin-top:4px;" onclick="closeModal(); if(typeof window._notifOnClose === 'function') window._notifOnClose();">${t('close')}</button>
        </div>
      </div>
    </div>
  `;
  window._notifOnClose = onClosed;
}

function copyNotifText() {
  const el = document.getElementById('worker-notif-preview');
  if (!el) return;
  navigator.clipboard.writeText(el.innerText).then(() => {
    showToast('Notification message copied to clipboard!', 'success');
  }).catch(() => {
    showToast('Failed to copy', 'error');
  });
}

async function triggerSendWorkerNotification(purchaseId) {
  try {
    const res = await API.get(`/api/purchases/${purchaseId}/notification-text`);
    if (res.notification) {
      showWorkerNotificationModal(res.notification);
    }
  } catch (e) {}
}

function closeModal() {
  const modalRoot = document.getElementById('modal-root');
  if (modalRoot) modalRoot.innerHTML = '';
}

/* =========================================================================
   SUBMIT PURCHASE / SNAP BILL (MOBILE CAMERA COMPATIBLE)
   ========================================================================= */

async function renderSubmitPurchase() {
  const main = document.getElementById('main-content');
  const prodsRes = await API.get('/api/products');
  const mechsRes = await API.get('/api/mechanics');
  const products = prodsRes.products || [];
  const mechanics = mechsRes.mechanics || [];

  const isAuditorOrAdmin = AppState.user.role === 'admin' || AppState.user.role === 'auditor';

  main.innerHTML = `
    <div class="top-bar">
      <div>
        <h1 class="page-title">${t('submit_purchase_title')}</h1>
        <p style="font-size:13px;color:var(--text-muted)">${t('submit_purchase_sub')}</p>
      </div>
    </div>

    <div style="max-width: 680px; margin: 0 auto;">
      <form id="purchase-form" onsubmit="handlePurchaseSubmit(event)">
        ${isAuditorOrAdmin ? `
          <div class="card">
            <div class="card-title" style="margin-bottom:12px;">${t('select_mechanic_title')} <span style="color:var(--danger)">*</span></div>
            <div class="form-group">
              <label>${t('role_mechanic')} <span style="color:var(--danger)">*</span></label>
              <select id="pur-mechanic-id" onchange="handleDropdownWithCustom(this, 'pur-mechanic-search')">
                <option value="">${t('choose_mech_dropdown')}</option>
                ${mechanics.filter(m => m.is_active).map(m => `
                  <option value="${m.id}">${m.name} (${m.uid} · ${m.trade_type} · ${m.phone})</option>
                `).join('')}
              </select>
              <input type="text" id="pur-mechanic-search" list="pur-mechanics-datalist" placeholder="${t('search_mech_placeholder')}" style="margin-top:6px;" oninput="handlePurMechSearchInput(this)">
              <datalist id="pur-mechanics-datalist">
                ${mechanics.filter(m => m.is_active).map(m => `
                  <option value="${m.name} (${m.uid} · ${m.phone})"></option>
                `).join('')}
              </datalist>
            </div>
          </div>
        ` : ''}

        <div class="card">
          <div class="card-title" style="margin-bottom:12px;">${t('cust_date_title')} <span style="color:var(--danger)">*</span></div>
          <div class="form-row">
            <div class="form-group">
              <label>${t('purchase_date')} <span style="color:var(--danger)">*</span></label>
              <input type="date" id="pur-date" value="${new Date().toISOString().slice(0, 10)}" required>
            </div>
            <div class="form-group">
              <label>${t('cust_name')} <span style="color:var(--danger)">*</span></label>
              <input type="text" id="pur-cust-name" placeholder="${t('cust_name_placeholder')}" required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>${t('cust_phone')} <span style="color:var(--danger)">*</span></label>
              <input type="tel" id="pur-cust-phone" pattern="[0-9]{10}" maxlength="10" minlength="10" inputmode="numeric" placeholder="${t('cust_phone')}" required autocomplete="tel">
              <small style="color:var(--text-muted);font-size:11px;">Mandatory 10-digit mobile number for audit verification.</small>
            </div>
            <div class="form-group">
              <label>${t('cust_addr')}</label>
              <input type="text" id="pur-cust-addr" placeholder="${t('cust_addr_placeholder')}">
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header" style="margin-bottom:8px;">
            <div class="card-title">${t('products_purchased_title')} <span style="font-size:12px;color:var(--text-muted);font-weight:normal;">${t('optional_badge')}</span></div>
          </div>
          <p style="font-size:12px;color:var(--text-muted);margin-bottom:10px;">${t('products_purchased_sub')}</p>
          
          <datalist id="common-units-list">
            <option value="Piece">
            <option value="Bag">
            <option value="Meter">
            <option value="Box">
            <option value="Kg">
            <option value="Liter">
            <option value="Bundle">
            <option value="Pair">
            <option value="Set">
            <option value="Foot">
            <option value="Sq Ft">
            <option value="Packet">
            <option value="Roll">
            <option value="Nos">
            <option value="Length">
          </datalist>

          <div class="purchase-items-header">
            <div>${t('th_catalog_dd')}</div>
            <div>${t('th_item_name')}</div>
            <div>${t('th_quantity')}</div>
            <div>${t('th_unit')}</div>
            <div></div>
          </div>

          <div id="items-container">
            <!-- Dynamic item rows -->
          </div>
          <button type="button" class="btn btn-secondary btn-sm" style="margin-top:8px;" onclick="addPurchaseItemRow()">${t('add_product_line')}</button>
        </div>

        <div class="card">
          <div class="card-header" style="margin-bottom:8px;">
            <div class="card-title">${t('amount_photo_title')} <span style="font-size:12px;color:var(--text-muted);font-weight:normal;">${t('optional_badge')}</span></div>
          </div>
          <div class="form-group">
            <label>${t('total_bill_amount')} ${t('optional_badge')}</label>
            <input type="number" id="pur-amount" placeholder="e.g. 4500" min="0" step="any">
          </div>

          <div class="form-group">
            <label>${t('bill_photo_receipt')} ${t('optional_badge')}</label>
            <input type="file" id="pur-file" accept="image/*,.pdf" capture="environment" onchange="handleBillFileSelected(this)">
            <small style="color:var(--text-muted)">${t('bill_photo_sub')}</small>
            <div id="file-preview-slot" style="margin-top:10px;"></div>
          </div>
        </div>

        <button type="submit" class="btn btn-primary btn-lg" id="pur-submit-btn">${t('submit_bill_btn')}</button>
      </form>
    </div>
  `;

  // Store products and mechanics for dynamic rows and search
  window._availableProducts = products;
  window._availableMechanics = mechanics;

  // Add one empty product line row by default for convenience
  addPurchaseItemRow();
}

let uploadedBillUrl = '';

function addPurchaseItemRow() {
  const container = document.getElementById('items-container');
  if (!container) return;
  const rowId = 'row_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);

  const div = document.createElement('div');
  div.id = rowId;
  div.className = 'purchase-item-row';
  div.innerHTML = `
    <div class="col-prod">
      <select class="item-prod-select" onchange="handleProductSelected(this, '${rowId}')">
        <option value="">-- Choose Product (Optional) --</option>
        ${(window._availableProducts || []).map(p => `
          <option value="${p.id}" data-unit="${p.unit || 'Piece'}" data-name="${p.name}">${p.name} (${p.category})</option>
        `).join('')}
        <option value="__custom__" data-unit="Piece" data-name="">✏️ Type Custom Item...</option>
      </select>
    </div>
    <div class="col-custom">
      <input type="text" class="item-custom-name" placeholder="Item Name (or type custom item)" oninput="handleCustomNameInput(this, '${rowId}')">
    </div>
    <div class="col-qty">
      <input type="number" class="item-qty" placeholder="Qty" min="0.01" step="any" value="1">
    </div>
    <div class="col-unit">
      <input type="text" class="item-unit" placeholder="Unit" list="common-units-list" value="Piece">
    </div>
    <div class="col-action">
      <button type="button" class="btn btn-danger btn-sm" onclick="document.getElementById('${rowId}').remove()" title="Remove row" style="padding:6px 10px;line-height:1;">✕</button>
    </div>
  `;
  container.appendChild(div);
}

function handleProductSelected(selectEl, rowId) {
  const row = document.getElementById(rowId);
  if (!row) return;
  const opt = selectEl.options[selectEl.selectedIndex];
  const nameInput = row.querySelector('.item-custom-name');
  const unitInput = row.querySelector('.item-unit');

  if (selectEl.value === '__custom__') {
    if (nameInput) {
      nameInput.value = '';
      nameInput.focus();
    }
    if (unitInput && !unitInput.value) unitInput.value = 'Piece';
  } else if (selectEl.value) {
    const pName = opt.getAttribute('data-name') || opt.text;
    const pUnit = opt.getAttribute('data-unit') || 'Piece';
    if (nameInput) nameInput.value = pName;
    if (unitInput) unitInput.value = pUnit;
  }
}

function handleCustomNameInput(input, rowId) {
  const row = document.getElementById(rowId);
  if (!row) return;
  const selectEl = row.querySelector('.item-prod-select');
  if (!selectEl) return;
  
  const val = input.value.trim().toLowerCase();
  if (!val) return;

  // Check if val matches an existing option
  let matched = false;
  for (let i = 0; i < selectEl.options.length; i++) {
    const opt = selectEl.options[i];
    const dataName = (opt.getAttribute('data-name') || '').toLowerCase();
    if (dataName && dataName === val) {
      selectEl.selectedIndex = i;
      matched = true;
      break;
    }
  }
  if (!matched && selectEl.value && selectEl.value !== '__custom__') {
    const opt = selectEl.options[selectEl.selectedIndex];
    const dataName = (opt.getAttribute('data-name') || '').toLowerCase();
    if (dataName !== val) {
      selectEl.value = '__custom__';
    }
  }
}

function handleBillFileSelected(input) {
  const file = input.files[0];
  if (!file) return;

  const slot = document.getElementById('file-preview-slot');
  slot.innerHTML = `<p style="font-size:12px;color:var(--text-muted)">Processing and compressing photo...</p>`;

  const reader = new FileReader();
  reader.onload = async (e) => {
    const dataUrl = e.target.result;
    try {
      const res = await API.post('/api/upload', { dataUrl, filename: file.name });
      uploadedBillUrl = res.fileUrl;
      slot.innerHTML = `
        <div style="background:#F1F5F9;padding:8px;border-radius:var(--radius-sm);display:flex;align-items:center;gap:10px;">
          ${file.type.startsWith('image') ? `<img src="${uploadedBillUrl}" style="height:60px;width:60px;object-fit:cover;border-radius:4px;">` : '📄'}
          <div>
            <div style="font-size:12px;font-weight:600;color:var(--success)">✓ Photo uploaded securely</div>
            <div style="font-size:11px;color:var(--text-muted)">${file.name} (${Math.round(file.size / 1024)} KB)</div>
          </div>
        </div>
      `;
      showToast('Bill photo uploaded ready', 'success');
    } catch (err) {
      slot.innerHTML = `<p style="color:var(--danger)">Upload failed: ${err.message}</p>`;
    }
  };
  reader.readAsDataURL(file);
}

async function handlePurchaseSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('pur-submit-btn');

  const mechSelect = document.getElementById('pur-mechanic-id');
  const mechSearch = document.getElementById('pur-mechanic-search');
  let mechanicId = mechSelect ? mechSelect.value : (AppState.user ? AppState.user.mechanicId : null);

  if ((AppState.user.role === 'admin' || AppState.user.role === 'auditor') && (!mechanicId || mechanicId === '')) {
    const query = mechSearch ? mechSearch.value.trim().toLowerCase() : '';
    if (query) {
      const match = (window._availableMechanics || []).find(m => 
        m.name.toLowerCase().includes(query) || 
        m.uid.toLowerCase().includes(query) || 
        m.phone.includes(query)
      );
      if (match) mechanicId = match.id;
    }
  }

  if ((AppState.user.role === 'admin' || AppState.user.role === 'auditor') && !mechanicId) {
    return showToast('Please select or type a mechanic', 'error');
  }

  const purchaseDate = document.getElementById('pur-date').value;
  const customerName = document.getElementById('pur-cust-name').value.trim();
  const customerPhone = document.getElementById('pur-cust-phone').value.trim();
  const customerAddress = document.getElementById('pur-cust-addr').value.trim();
  const totalAmount = parseFloat(document.getElementById('pur-amount').value) || 0;

  if (!purchaseDate) {
    return showToast('Purchase Date is required', 'error');
  }
  if (!customerName) {
    return showToast('Customer Name is required', 'error');
  }

  const cleanCustPhone = customerPhone.replace(/[^0-9]/g, '');
  if (!cleanCustPhone || cleanCustPhone.length !== 10) {
    return showToast('Customer mobile number is mandatory and must be exactly 10 digits', 'error');
  }

  // Collect item rows (optional - can be catalog item or custom typed item)
  const itemRows = document.querySelectorAll('#items-container .purchase-item-row, #items-container .form-row');
  const items = [];
  itemRows.forEach(row => {
    const sel = row.querySelector('.item-prod-select');
    const customInp = row.querySelector('.item-custom-name');
    const qtyInp = row.querySelector('.item-qty');
    const unitInp = row.querySelector('.item-unit');

    const qty = parseFloat(qtyInp ? qtyInp.value : 1) || 1;
    const unit = (unitInp ? unitInp.value : 'Piece').trim() || 'Piece';

    let productId = null;
    let productName = '';

    const typedName = customInp ? customInp.value.trim() : '';

    if (typedName) {
      productName = typedName;
      if (sel && sel.value && sel.value !== '__custom__') {
        const opt = sel.options[sel.selectedIndex];
        const dataName = opt.getAttribute('data-name');
        if (dataName && (dataName.toLowerCase() === typedName.toLowerCase() || opt.text.toLowerCase().includes(typedName.toLowerCase()))) {
          productId = parseInt(sel.value, 10);
        }
      }
    } else if (sel && sel.value && sel.value !== '__custom__') {
      const opt = sel.options[sel.selectedIndex];
      productId = parseInt(sel.value, 10);
      productName = opt.getAttribute('data-name') || opt.text;
    }

    if (productName) {
      items.push({
        productId,
        productName,
        quantity: qty,
        unit
      });
    }
  });

  btn.disabled = true;
  btn.textContent = 'Submitting...';

  try {
    const payload = {
      mechanicId,
      purchaseDate,
      customerName,
      customerPhone,
      customerAddress,
      totalAmount,
      billFileUrl: uploadedBillUrl,
      items
    };

    const res = await API.post('/api/purchases', payload);
    showToast('Purchase submitted successfully!', 'success');
    uploadedBillUrl = '';

    if (res.notification && (AppState.user.role === 'admin' || AppState.user.role === 'auditor')) {
      showWorkerNotificationModal(res.notification, () => {
        navigate(AppState.user.role === 'mechanic' ? 'purchases' : 'verifications');
      });
    } else {
      navigate(AppState.user.role === 'mechanic' ? 'purchases' : 'verifications');
    }
  } catch (err) {
    btn.disabled = false;
    btn.textContent = 'Submit Purchase & Generate Bill';
  }
}

/* =========================================================================
   MECHANICS DIRECTORY & PROFILE VIEW
   ========================================================================= */

async function renderMechanicsList() {
  const main = document.getElementById('main-content');
  const res = await API.get('/api/mechanics');
  const mechanics = res.mechanics || [];
  const isAdmin = AppState.user.role === 'admin';

  main.innerHTML = `
    <div class="top-bar">
      <div>
        <h1 class="page-title">${t('mechanics_directory_title')}</h1>
        <p style="font-size:13px;color:var(--text-muted)">${t('mechanics_directory_sub')}</p>
      </div>
      <div class="top-actions">
        ${isAdmin ? `<button class="btn btn-primary btn-sm" onclick="openAddMechanicModal()">${t('register_mechanic_btn')}</button>` : ''}
      </div>
    </div>

    <div class="card" style="margin-bottom:12px;">
      <div class="form-row">
        <input type="text" id="mech-search" placeholder="${t('search_mechanics_placeholder')}" oninput="filterMechanicsTable(this.value)">
      </div>
    </div>

    <div class="card" style="padding:0;">
      <div class="table-responsive">
        <table id="mechanics-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>${t('full_name')}</th>
              <th>${t('trade_category')}</th>
              <th>${t('phone')}</th>
              <th>${t('available_points')}</th>
              <th>${t('lifetime_points')}</th>
              <th>${t('th_pending_bills')}</th>
              <th>${t('status')}</th>
              <th>${t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            ${mechanics.map(m => `
              <tr data-search="${(m.name + m.phone + m.uid + m.trade_type + m.address).toLowerCase()}">
                <td><b>${m.uid}</b></td>
                <td><b>${m.name}</b><br><small style="color:var(--text-muted)">${m.address}</small></td>
                <td><span class="badge" style="background:#E2E8F0;">${m.trade_type}</span></td>
                <td>
                  <b>${m.phone}</b>
                  <div style="display:flex;gap:4px;margin-top:4px;flex-wrap:wrap;">
                    <a href="tel:${m.phone}" class="btn btn-secondary btn-sm" style="padding:2px 6px;font-size:11px;" title="${t('call_worker')}">📞 Call</a>
                    <a href="https://wa.me/91${m.phone}" target="_blank" class="btn btn-secondary btn-sm" style="padding:2px 6px;font-size:11px;background:#DCFCE7;color:#166534;" title="WhatsApp">💬 WA</a>
                    <button type="button" class="btn btn-secondary btn-sm" onclick="sendWorkerWelcomeGreetingPrompt('${m.name.replace(/'/g, "\\'")}', '${m.uid}', '${m.phone}', '${m.trade_type}')" style="padding:2px 6px;font-size:11px;background:#F0FDF4;color:#15803D;border:1px solid #BBF7D0;" title="Send WhatsApp Welcome Greeting">🎉 Greeting</button>
                  </div>
                </td>
                <td><b style="color:var(--primary);font-size:15px;">${m.available_points}</b>${m.recovery_points > 0 ? `<br><small style="color:var(--danger)">Recovery: ${m.recovery_points}</small>` : ''}</td>
                <td>${m.lifetime_points}</td>
                <td>${m.pending_bills_count > 0 ? `<span class="badge badge-pending">${m.pending_bills_count}</span>` : '0'}</td>
                <td><span class="badge ${m.is_active ? 'badge-active' : 'badge-inactive'}">${m.is_active ? t('active') : t('inactive')}</span></td>
                <td>
                  <button class="btn btn-secondary btn-sm" onclick="navigate('mechanic_detail', ${m.id})">${t('profile')}</button>
                  ${isAdmin ? `
                    <button class="btn btn-secondary btn-sm" onclick="openResetMechanicPasswordModal(${m.id}, '${m.name.replace(/'/g, "\\'")}', '${m.uid}')" title="${t('reset_pw')}">🔑 ${t('reset_pw')}</button>
                    <button class="btn btn-secondary btn-sm" onclick="toggleMechanicStatus(${m.id})">${m.is_active ? t('deactivate') : t('activate')}</button>
                  ` : ''}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function filterMechanicsTable(query) {
  const q = query.toLowerCase().trim();
  const rows = document.querySelectorAll('#mechanics-table tbody tr');
  rows.forEach(r => {
    const text = r.getAttribute('data-search') || '';
    r.style.display = text.includes(q) ? '' : 'none';
  });
}

// Modal: Add Mechanic
function openAddMechanicModal() {
  const modalRoot = document.getElementById('modal-root');
  modalRoot.innerHTML = `
    <div class="modal-backdrop" onclick="closeModal()">
      <div class="modal-content" onclick="event.stopPropagation()">
        <div class="modal-header">
          <div class="card-title">Register New Mechanic</div>
          <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <form onsubmit="handleAddMechanicSubmit(event)">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" id="new-m-name" required placeholder="e.g. Rajesh Kumar">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>10-Digit Mobile Number <span style="color:var(--danger)">*</span></label>
              <input type="tel" id="new-m-phone" required pattern="[0-9]{10}" maxlength="10" minlength="10" inputmode="numeric" placeholder="10-digit mobile number">
            </div>
            <div class="form-group">
              <label>Trade / Specialty</label>
              <select id="new-m-type" onchange="handleDropdownWithCustom(this, 'new-m-type-custom')">
                <option value="">-- Choose Trade --</option>
                ${TRADE_TYPES.map(t => `<option value="${t}">${t}</option>`).join('')}
                <option value="__custom__">✏️ Other / Custom Trade (Type below)</option>
              </select>
              <input type="text" id="new-m-type-custom" placeholder="Or type custom Trade / Specialty..." style="margin-top:6px;">
            </div>
          </div>
          <div class="form-group">
            <label>Address / Shop Location</label>
            <input type="text" id="new-m-addr" required placeholder="e.g. Gandhi Maidan, Patna">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Login User ID <span style="color:var(--danger)">*</span></label>
              <input type="text" id="new-m-uid" required placeholder="e.g. MEC1007" autocomplete="off" value="">
            </div>
            <div class="form-group">
              <label>Create Password <span style="color:var(--danger)">*</span></label>
              <div style="position:relative;display:flex;align-items:center;">
                <input type="password" id="new-m-pw" required minlength="4" placeholder="Enter password (min 4 chars)" autocomplete="new-password" value="" style="padding-right:38px;width:100%;">
                <button type="button" onclick="togglePasswordVisibility('new-m-pw', this)" style="position:absolute;right:8px;background:none;border:none;cursor:pointer;font-size:15px;color:var(--text-muted);" title="Toggle visibility">👁️</button>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Confirm Password <span style="color:var(--danger)">*</span></label>
              <div style="position:relative;display:flex;align-items:center;">
                <input type="password" id="new-m-confirm-pw" required minlength="4" placeholder="Re-enter password" autocomplete="new-password" value="" style="padding-right:38px;width:100%;">
                <button type="button" onclick="togglePasswordVisibility('new-m-confirm-pw', this)" style="position:absolute;right:8px;background:none;border:none;cursor:pointer;font-size:15px;color:var(--text-muted);" title="Toggle visibility">👁️</button>
              </div>
            </div>
          </div>
          <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px;">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Save & Register</button>
          </div>
        </form>
      </div>
    </div>
  `;
  // Ensure fields are explicitly cleared of any browser autofill
  setTimeout(() => {
    const p1 = document.getElementById('new-m-pw');
    const p2 = document.getElementById('new-m-confirm-pw');
    if (p1) p1.value = '';
    if (p2) p2.value = '';
  }, 60);
}

async function handleAddMechanicSubmit(e) {
  e.preventDefault();
  const customTrade = document.getElementById('new-m-type-custom') ? document.getElementById('new-m-type-custom').value.trim() : '';
  const selTrade = document.getElementById('new-m-type') ? document.getElementById('new-m-type').value : '';
  const trade_type = customTrade || (selTrade && selTrade !== '__custom__' ? selTrade : 'Others');
  const phone = document.getElementById('new-m-phone').value.trim();
  const cleanPhone = phone.replace(/[^0-9]/g, '');

  if (!cleanPhone || cleanPhone.length !== 10) {
    return showToast('Mechanic mobile number is mandatory and must be exactly 10 digits', 'error');
  }

  const pw = document.getElementById('new-m-pw') ? document.getElementById('new-m-pw').value : '';
  const confirmPw = document.getElementById('new-m-confirm-pw') ? document.getElementById('new-m-confirm-pw').value : '';

  if (!pw || pw.length < 4) {
    return showToast('Password is mandatory and must be at least 4 characters long', 'error');
  }
  if (pw !== confirmPw) {
    return showToast('Passwords do not match. Please re-enter.', 'error');
  }

  const payload = {
    name: document.getElementById('new-m-name').value.trim(),
    phone: cleanPhone,
    trade_type: trade_type,
    address: document.getElementById('new-m-addr').value.trim(),
    uid: document.getElementById('new-m-uid').value.trim(),
    password: pw
  };

  try {
    const res = await API.post('/api/mechanics', payload);
    showToast('Mechanic registered successfully', 'success');
    closeModal();
    if (res.welcomeGreeting) {
      showWorkerWelcomeModal(res.welcomeGreeting, () => {
        renderMechanicsList();
      });
    } else {
      renderMechanicsList();
    }
  } catch (err) {}
}

async function toggleMechanicStatus(id) {
  try {
    await API.patch(`/api/mechanics/${id}/status`, {});
    showToast('Status updated', 'success');
    renderMechanicsList();
  } catch (e) {}
}

/* =========================================================================
   CATEGORY WORKERS VIEW (NEW PAGE WHEN CLICKING TRADE CATEGORY)
   ========================================================================= */

async function renderCategoryWorkers(categoryType) {
  const main = document.getElementById('main-content');
  const type = categoryType || 'All';
  const res = await API.get(`/api/mechanics?type=${encodeURIComponent(type)}`);
  const mechanics = res.mechanics || [];
  const isAdmin = AppState.user.role === 'admin';

  // Compute category specific totals
  const totalWorkers = mechanics.length;
  const activeWorkers = mechanics.filter(m => m.is_active).length;
  const totalLifetimePoints = mechanics.reduce((sum, m) => sum + (m.lifetime_points || 0), 0);
  const totalAvailablePoints = mechanics.reduce((sum, m) => sum + (m.available_points || 0), 0);
  const totalPendingBills = mechanics.reduce((sum, m) => sum + (m.pending_bills_count || 0), 0);

  main.innerHTML = `
    <div class="top-bar">
      <div>
        <button class="btn btn-secondary btn-sm" onclick="navigate('dash')" style="margin-bottom:8px;">${t('back_to_dash')}</button>
        <h1 class="page-title">👷 ${t('category_workers_title', '', { cat: type })}</h1>
        <p style="font-size:13px;color:var(--text-muted)">
          ${t('category_workers_sub', '', { cat: type })}
        </p>
      </div>
      <div class="top-actions">
        ${isAdmin ? `<button class="btn btn-primary btn-sm" onclick="openAddMechanicModal()">${t('add_worker_btn', '', { cat: type })}</button>` : ''}
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">${t('total_in_cat', '', { cat: type })}</div>
        <div class="stat-value">${totalWorkers}</div>
        <span style="font-size:11px;color:var(--success)">${activeWorkers} ${t('stat_active_in_field')}</span>
      </div>

      <div class="stat-card">
        <div class="stat-label">${t('th_avail_points')}</div>
        <div class="stat-value" style="color:var(--primary);">${totalAvailablePoints.toLocaleString()}</div>
        <span style="font-size:11px;color:var(--text-muted)">${t('across_all_cat', '', { cat: type })}</span>
      </div>

      <div class="stat-card">
        <div class="stat-label">${t('th_lifetime_points')}</div>
        <div class="stat-value" style="color:var(--success);">${totalLifetimePoints.toLocaleString()}</div>
        <span style="font-size:11px;color:var(--text-muted)">${t('total_earned_to_date')}</span>
      </div>

      <div class="stat-card ${totalPendingBills > 0 ? 'highlight' : ''}">
        <div class="stat-label">${t('stat_pending_verification')}</div>
        <div class="stat-value" style="color:${totalPendingBills > 0 ? 'var(--warning)' : 'var(--primary)'};">${totalPendingBills}</div>
        <span style="font-size:11px;color:var(--text-muted)">${t('awaiting_audit')}</span>
      </div>
    </div>

    <div class="card" style="margin-bottom:12px;">
      <div class="form-row">
        <input type="text" id="cat-mech-search" placeholder="${t('search_cat_placeholder', '', { cat: type })}" oninput="filterCategoryMechanicsTable(this.value)">
      </div>
    </div>

    <div class="card" style="padding:0;">
      <div class="table-responsive">
        <table id="cat-mechanics-table">
          <thead>
            <tr>
              <th>${t('th_user_id')}</th>
              <th>${t('th_worker_name_click')}</th>
              <th>${t('th_phone_contact')}</th>
              <th>${t('th_address_shop')}</th>
              <th>${t('th_avail_points')}</th>
              <th>${t('th_lifetime_points')}</th>
              <th>${t('th_pending_bills_count')}</th>
              <th>${t('th_status')}</th>
              <th>${t('th_action')}</th>
            </tr>
          </thead>
          <tbody>
            ${mechanics.length === 0 ? `
              <tr><td colspan="9" style="text-align:center;padding:32px;color:var(--text-muted);">${t('no_workers_cat', '', { cat: type })}</td></tr>
            ` : mechanics.map(m => `
              <tr data-search="${(m.name + m.phone + m.uid + m.trade_type + m.address).toLowerCase()}">
                <td><b>${m.uid}</b></td>
                <td>
                  <a onclick="navigate('mechanic_detail', ${m.id})" style="color:var(--accent);font-weight:700;font-size:14px;cursor:pointer;text-decoration:underline;">
                    ${m.name} ➔
                  </a>
                </td>
                <td>
                  <b>${m.phone}</b>
                  <div style="display:flex;gap:4px;margin-top:4px;flex-wrap:wrap;">
                    <a href="tel:${m.phone}" class="btn btn-secondary btn-sm" style="padding:2px 6px;font-size:11px;" title="${t('call_worker')}">📞 Call</a>
                    <a href="https://wa.me/91${m.phone}" target="_blank" class="btn btn-secondary btn-sm" style="padding:2px 6px;font-size:11px;background:#DCFCE7;color:#166534;" title="WhatsApp">💬 WA</a>
                    <button type="button" class="btn btn-secondary btn-sm" onclick="sendWorkerWelcomeGreetingPrompt('${m.name.replace(/'/g, "\\'")}', '${m.uid}', '${m.phone}', '${m.trade_type}')" style="padding:2px 6px;font-size:11px;background:#F0FDF4;color:#15803D;border:1px solid #BBF7D0;" title="Send WhatsApp Welcome Greeting">🎉 Greeting</button>
                  </div>
                </td>
                <td><small style="color:var(--text-muted)">${m.address}</small></td>
                <td>
                  <b style="color:var(--primary);font-size:15px;">${m.available_points}</b>
                  ${m.recovery_points > 0 ? `<br><small style="color:var(--danger)">${t('recovery_pending')}: ${m.recovery_points}</small>` : ''}
                </td>
                <td><b style="color:var(--success);">${m.lifetime_points}</b></td>
                <td>${m.pending_bills_count > 0 ? `<span class="badge badge-pending">${m.pending_bills_count} ${t('pending')}</span>` : '<span style="color:var(--text-muted)">0</span>'}</td>
                <td><span class="badge ${m.is_active ? 'badge-active' : 'badge-inactive'}">${m.is_active ? t('active') : t('inactive')}</span></td>
                <td>
                  <button class="btn btn-primary btn-sm" onclick="navigate('mechanic_detail', ${m.id})">${t('view_full_profile')}</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function filterCategoryMechanicsTable(query) {
  const q = query.toLowerCase().trim();
  const rows = document.querySelectorAll('#cat-mechanics-table tbody tr');
  rows.forEach(r => {
    const text = r.getAttribute('data-search') || '';
    r.style.display = text.includes(q) ? '' : 'none';
  });
}

/* =========================================================================
   MECHANIC DETAIL & COMPLETE PROFILE VIEW
   ========================================================================= */

async function renderMechanicDetail(mechanicId) {
  const main = document.getElementById('main-content');
  const res = await API.get(`/api/mechanics/${mechanicId}`);
  const m = res.mechanic;
  const ledger = res.ledger || [];
  const purchases = res.purchases || [];
  const isAdmin = AppState.user.role === 'admin';

  const approvedPurchases = purchases.filter(p => p.status === 'APPROVED');
  const pendingPurchases = purchases.filter(p => p.status === 'PENDING');
  const totalApprovedSpend = approvedPurchases.reduce((sum, p) => sum + (p.total_amount || 0), 0);

  main.innerHTML = `
    <div class="top-bar">
      <div>
        <div style="display:flex;gap:8px;margin-bottom:8px;flex-wrap:wrap;">
          <button class="btn btn-secondary btn-sm" onclick="navigate('category_workers', '${m.trade_type}')">${t('back_to_cat', '', { cat: m.trade_type })}</button>
          <button class="btn btn-secondary btn-sm" onclick="navigate('mechanics')">${t('all_mechanics_btn')}</button>
          <button class="btn btn-secondary btn-sm" onclick="navigate('dash')">📊 ${t('nav_dashboard')}</button>
        </div>
        <div style="display:flex;align-items:center;gap:10px;margin-top:6px;flex-wrap:wrap;">
          <h1 class="page-title" style="margin:0;">${m.name}</h1>
          <span class="badge" style="background:#E0F2FE;color:#0284C7;font-size:13px;">${m.trade_type}</span>
          <span class="badge ${m.is_active ? 'badge-active' : 'badge-inactive'}">${m.is_active ? t('active_account') : t('inactive_account')}</span>
        </div>
        <p style="font-size:13px;color:var(--text-muted);margin-top:4px;">
          <b>${t('user_id_label')}:</b> ${m.uid} · <b>${t('phone')}:</b> ${m.phone} · <b>${t('address')}:</b> ${m.address}
        </p>
      </div>
      <div class="top-actions" style="display:flex;gap:6px;flex-wrap:wrap;">
        <a href="tel:${m.phone}" class="btn btn-secondary btn-sm">📞 ${t('call_worker')}</a>
        <a href="https://wa.me/91${m.phone}" target="_blank" class="btn btn-secondary btn-sm" style="background:#DCFCE7;color:#166534;">💬 ${t('whatsapp')}</a>
        <button type="button" class="btn btn-secondary btn-sm" onclick="sendWorkerWelcomeGreetingPrompt('${m.name.replace(/'/g, "\\'")}', '${m.uid}', '${m.phone}', '${m.trade_type}')" style="background:#F0FDF4;color:#15803D;border:1px solid #BBF7D0;font-weight:600;">🎉 Send Welcome Greeting</button>
        ${isAdmin ? `
          <button class="btn btn-secondary btn-sm" onclick="openResetMechanicPasswordModal(${m.id}, '${m.name.replace(/'/g, "\\'")}', '${m.uid}')">${t('reset_pw_btn')}</button>
          <button class="btn btn-primary btn-sm" onclick="openAdjustPointsModal(${m.id}, '${m.name}')">${t('adjust_points_btn')}</button>
          <button class="btn btn-secondary btn-sm" onclick="toggleMechanicStatusDetail(${m.id})">${m.is_active ? t('deactivate') : t('activate')}</button>
        ` : ''}
      </div>
    </div>

    <!-- Overview KPI Grid -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">${t('th_avail_points')}</div>
        <div class="stat-value" style="color:var(--primary);">${m.available_points}</div>
        <span style="font-size:11px;color:var(--text-muted)">${t('ready_for_redemption')}</span>
      </div>

      <div class="stat-card">
        <div class="stat-label">${t('th_lifetime_points')}</div>
        <div class="stat-value" style="color:var(--success);">${m.lifetime_points}</div>
        <span style="font-size:11px;color:var(--text-muted)">${t('total_points_earned')}</span>
      </div>

      <div class="stat-card ${m.recovery_points > 0 ? 'highlight' : ''}">
        <div class="stat-label">${t('recovery_pending')}</div>
        <div class="stat-value" style="color:${m.recovery_points > 0 ? 'var(--danger)' : 'var(--text-muted)'};">${m.recovery_points}</div>
        <span style="font-size:11px;color:var(--text-muted)">${t('deducted_future_bills')}</span>
      </div>

      <div class="stat-card">
        <div class="stat-label">${t('stat_approved_purchases')}</div>
        <div class="stat-value" style="color:var(--success);">${approvedPurchases.length}</div>
        <span style="font-size:11px;color:var(--text-muted)">${formatINR(totalApprovedSpend)} ${t('stat_total_value')}</span>
      </div>
    </div>

    <!-- Purchases History Table Card -->
    <div class="card" style="margin-bottom:16px;">
      <div class="card-header">
        <div>
          <div class="card-title">🧾 ${t('nav_purchases')} (${purchases.length})</div>
          <small style="color:var(--text-muted)">${t('all_historical_bills', '', { name: m.name })}</small>
        </div>
        ${pendingPurchases.length > 0 ? `<span class="badge badge-pending">${pendingPurchases.length} ${t('stat_pending_verification')}</span>` : ''}
      </div>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>${t('date')}</th>
              <th>${t('customer')}</th>
              <th>${t('items')}</th>
              <th>${t('amount')}</th>
              <th>${t('status')}</th>
              <th>${t('points')}</th>
              <th>${t('bill_receipt')}</th>
              <th>${t('whatsapp')}</th>
            </tr>
          </thead>
          <tbody>
            ${purchases.length === 0 ? `
              <tr><td colspan="9" style="text-align:center;padding:24px;color:var(--text-muted);">${t('no_purchases_found')}</td></tr>
            ` : purchases.map(p => `
              <tr>
                <td><b>#${p.id}</b></td>
                <td>${p.purchase_date}</td>
                <td>
                  <b>${p.customer_name}</b><br>
                  <small style="color:var(--text-muted)">${p.customer_phone}</small><br>
                  <small style="color:var(--text-muted)">${p.customer_address}</small>
                </td>
                <td>${(p.items || []).map(i => `${i.product_name} (${i.quantity} ${i.unit})`).join('<br>') || '-'}</td>
                <td><b style="font-size:14px;">${formatINR(p.total_amount)}</b></td>
                <td>
                  <span class="badge badge-${p.status.toLowerCase()}">${p.status === 'APPROVED' ? t('approved') : p.status === 'PENDING' ? t('pending') : t('rejected')}</span>
                  ${p.rejection_reason ? `<br><small style="color:var(--danger)">${t('rejection_reason')}: ${p.rejection_reason}</small>` : ''}
                  ${p.correction_message ? `<br><small style="color:var(--warning)">${t('correction_msg')}: ${p.correction_message}</small>` : ''}
                </td>
                <td><b style="color:${p.points_awarded ? 'var(--success)' : 'inherit'};">${p.points_awarded !== null ? `+${p.points_awarded} pts` : '-'}</b></td>
                <td>
                  ${p.bill_file_url ? `
                    <button class="btn btn-secondary btn-sm" onclick="openBillViewerModal('${p.bill_file_url}', ${p.id})">🖼️ ${t('view')}</button>
                  ` : `<span style="color:var(--text-muted);font-size:12px;">-</span>`}
                </td>
                <td>
                  <button class="btn btn-secondary btn-sm" style="background:#DCFCE7;color:#166534;" onclick="triggerSendWorkerNotification(${p.id})">
                    💬 ${t('whatsapp')}
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Points Ledger & Audit Trail -->
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">${t('points_ledger_title')}</div>
          <small style="color:var(--text-muted)">${t('points_ledger_sub')}</small>
        </div>
      </div>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>${t('th_timestamp')}</th>
              <th>${t('th_txn_type')}</th>
              <th>${t('th_desc_reason')}</th>
              <th>${t('th_points_change')}</th>
              <th>${t('th_bal_after')}</th>
              <th>${t('th_auditor_actor')}</th>
            </tr>
          </thead>
          <tbody>
            ${ledger.length === 0 ? `
              <tr><td colspan="6" style="text-align:center;padding:24px;color:var(--text-muted);">${t('no_txns_found')}</td></tr>
            ` : ledger.map(t_item => `
              <tr>
                <td>${t_item.created_at}</td>
                <td><span class="badge" style="background:#E2E8F0;">${t_item.type}</span></td>
                <td>
                  ${t_item.description}
                  ${t_item.reason ? `<br><small style="color:var(--text-muted)">Reason: ${t_item.reason}</small>` : ''}
                </td>
                <td><b style="font-size:14px;color:${t_item.points >= 0 ? 'var(--success)' : 'var(--danger)'};">${t_item.points > 0 ? '+' : ''}${t_item.points} pts</b></td>
                <td><b>${t_item.balance_after} pts</b></td>
                <td>${t_item.created_by || 'System'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

async function toggleMechanicStatusDetail(id) {
  try {
    await API.patch(`/api/mechanics/${id}/status`, {});
    showToast('Mechanic status updated', 'success');
    renderMechanicDetail(id);
  } catch (e) {}
}

// Modal: Manual Point Adjustment
function openAdjustPointsModal(mechId, mechName) {
  const modalRoot = document.getElementById('modal-root');
  modalRoot.innerHTML = `
    <div class="modal-backdrop" onclick="closeModal()">
      <div class="modal-content" onclick="event.stopPropagation()">
        <div class="modal-header">
          <div class="card-title">Adjust Points: ${mechName}</div>
          <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <form onsubmit="handleAdjustPointsSubmit(event, ${mechId})">
          <div class="form-group">
            <label>Points to Add or Deduct</label>
            <input type="number" id="adj-points" required placeholder="e.g. +100 or -50">
            <small style="color:var(--text-muted)">Enter positive number to credit, negative to deduct.</small>
          </div>
          <div class="form-group">
            <label>Adjustment Reason</label>
            <select id="adj-reason" onchange="handleDropdownWithCustom(this, 'adj-reason-custom')">
              <option value="Promotional Bonus">Promotional Bonus</option>
              <option value="Correction for Audit Discrepancy">Correction for Audit Discrepancy</option>
              <option value="Customer Service Adjustment">Customer Service Adjustment</option>
              <option value="System Error Resolution">System Error Resolution</option>
              <option value="Special Performance Incentive">Special Performance Incentive</option>
              <option value="__custom__">✏️ Other Custom Reason (Type below)</option>
            </select>
            <input type="text" id="adj-reason-custom" placeholder="Or type custom adjustment reason..." style="margin-top:6px;">
          </div>
          <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px;">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Apply Adjustment</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

async function handleAdjustPointsSubmit(e, mechId) {
  e.preventDefault();
  const pts = parseInt(document.getElementById('adj-points').value, 10);
  const customReason = document.getElementById('adj-reason-custom') ? document.getElementById('adj-reason-custom').value.trim() : '';
  const selReason = document.getElementById('adj-reason') ? document.getElementById('adj-reason').value : '';
  const reason = customReason || (selReason && selReason !== '__custom__' ? selReason : 'Admin Adjustment');

  try {
    await API.post(`/api/mechanics/${mechId}/adjust-points`, { points: pts, reason });
    showToast('Points adjusted successfully', 'success');
    closeModal();
    renderMechanicDetail(mechId);
  } catch (err) {}
}

// Modal: Admin Reset Mechanic Password
function openResetMechanicPasswordModal(mechId, mechName, mechUid) {
  const modalRoot = document.getElementById('modal-root');
  modalRoot.innerHTML = `
    <div class="modal-backdrop" onclick="closeModal()">
      <div class="modal-content" style="max-width:440px;" onclick="event.stopPropagation()">
        <div class="modal-header">
          <div>
            <div class="card-title">🔑 Reset Worker Password</div>
            <small style="color:var(--text-muted)">${mechName} (User ID: ${mechUid})</small>
          </div>
          <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <form onsubmit="handleAdminResetMechanicPasswordSubmit(event, ${mechId}, '${mechName.replace(/'/g, "\\'")}')">
          <div class="form-group" style="margin-bottom:14px;">
            <label>New Password <span style="color:var(--danger)">*</span></label>
            <div style="position:relative;display:flex;align-items:center;">
              <input type="password" id="admin-reset-pw" required minlength="4" placeholder="Enter new password (min 4 chars)" style="padding-right:40px;width:100%;">
              <button type="button" onclick="togglePasswordVisibility('admin-reset-pw', this)" style="position:absolute;right:10px;background:none;border:none;cursor:pointer;font-size:16px;color:var(--text-muted);" title="Toggle visibility">👁️</button>
            </div>
            <small style="color:var(--text-muted)">Minimum 4 characters.</small>
          </div>

          <div class="form-group" style="margin-bottom:18px;">
            <label>Confirm New Password <span style="color:var(--danger)">*</span></label>
            <div style="position:relative;display:flex;align-items:center;">
              <input type="password" id="admin-reset-confirm-pw" required minlength="4" placeholder="Re-enter new password" style="padding-right:40px;width:100%;">
              <button type="button" onclick="togglePasswordVisibility('admin-reset-confirm-pw', this)" style="position:absolute;right:10px;background:none;border:none;cursor:pointer;font-size:16px;color:var(--text-muted);" title="Toggle visibility">👁️</button>
            </div>
          </div>

          <div style="display:flex;justify-content:flex-end;gap:8px;">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary" id="admin-reset-submit-btn">Reset Password</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
  } else {
    input.type = 'password';
    btn.textContent = '👁️';
  }
}

async function handleAdminResetMechanicPasswordSubmit(e, mechId, mechName) {
  e.preventDefault();
  const newPw = document.getElementById('admin-reset-pw').value;
  const confirmPw = document.getElementById('admin-reset-confirm-pw').value;
  const submitBtn = document.getElementById('admin-reset-submit-btn');

  if (newPw.length < 4) {
    return showToast('Password must be at least 4 characters long', 'error');
  }

  if (newPw !== confirmPw) {
    return showToast('Passwords do not match! Please check and try again.', 'error');
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Updating...';

  try {
    const res = await API.post(`/api/mechanics/${mechId}/reset-password`, { newPassword: newPw });
    showToast(res.message || `Password successfully updated for ${mechName}`, 'success');
    closeModal();
    if (AppState.view === 'mechanic_detail') {
      renderMechanicDetail(mechId);
    } else if (AppState.view === 'mechanics') {
      renderMechanicsList();
    }
  } catch (err) {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Reset Password';
  }
}

/* =========================================================================
   PURCHASES AUDIT & LIST VIEW
   ========================================================================= */

async function renderPurchasesList() {
  const main = document.getElementById('main-content');
  const res = await API.get('/api/purchases');
  const purchases = res.purchases || [];
  const isAdminOrAuditor = AppState.user && (AppState.user.role === 'admin' || AppState.user.role === 'auditor');
  const isWorker = AppState.user && AppState.user.role === 'mechanic';

  main.innerHTML = `
    <div class="top-bar">
      <div>
        <h1 class="page-title">🧾 ${isWorker ? t('nav_my_purchases') : t('nav_purchases')}</h1>
        <p style="font-size:13px;color:var(--text-muted)">
          ${isWorker ? 'Track your submitted bills, verification status, and reward points' : 'Historical bills, verified status, and reward allocation'}
        </p>
      </div>
      <div class="top-actions">
        ${isAdminOrAuditor ? `<a href="/api/reports/export-purchases-csv" download class="btn btn-secondary btn-sm">${t('export_csv')}</a>` : ''}
        <button class="btn btn-primary btn-sm" onclick="navigate('submit_purchase')">+ ${t('submit_purchase_btn')}</button>
      </div>
    </div>

    <div class="card" style="padding:0;">
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>${t('date')}</th>
              ${isAdminOrAuditor ? `<th>${t('role_mechanic')}</th>` : ''}
              <th>${t('customer')}</th>
              <th>${t('items')}</th>
              <th>${t('amount')}</th>
              <th>${t('status')}</th>
              <th>${t('points')}</th>
              <th>${t('bill_receipt')}</th>
              ${isAdminOrAuditor ? `<th>${t('actions')}</th>` : ''}
            </tr>
          </thead>
          <tbody>
            ${purchases.length === 0 ? `<tr><td colspan="${isAdminOrAuditor ? 10 : 8}">${t('loading').replace('...', '')}</td></tr>` : purchases.map(p => `
              <tr>
                <td><b>#${p.id}</b></td>
                <td>${p.purchase_date}</td>
                ${isAdminOrAuditor ? `<td><b>${p.mechanic_name}</b><br><small style="color:var(--text-muted)">${p.trade_type}</small></td>` : ''}
                <td>${p.customer_name}<br><small style="color:var(--text-muted)">${p.customer_phone}</small></td>
                <td>${(p.items || []).map(i => `${i.product_name} (${i.quantity} ${i.unit})`).join('<br>') || '-'}</td>
                <td><b>${formatINR(p.total_amount)}</b></td>
                <td><span class="badge badge-${p.status.toLowerCase()}">${p.status === 'APPROVED' ? t('approved') : p.status === 'PENDING' ? t('pending') : t('rejected')}</span></td>
                <td><b>${p.points_awarded !== null ? p.points_awarded : '-'}</b></td>
                <td>
                  ${p.bill_file_url ? `<button class="btn btn-secondary btn-sm" onclick="openBillViewerModal('${p.bill_file_url}', ${p.id})">${t('view')}</button>` : '-'}
                </td>
                ${isAdminOrAuditor ? `
                  <td>
                    <button class="btn btn-secondary btn-sm" style="background:#DCFCE7;color:#166534;" onclick="triggerSendWorkerNotification(${p.id})">
                      💬 ${t('whatsapp')}
                    </button>
                  </td>
                ` : ''}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/* =========================================================================
   RETURNS & REVERSALS VIEW
   ========================================================================= */

/* =========================================================================
   RETURNS, REVERSALS & REPLACEMENTS VIEW & PROCESSOR
   ========================================================================= */

async function renderReturnsView() {
  const main = document.getElementById('main-content');
  
  // Fetch both processed returns and all purchases
  const [retRes, purRes] = await Promise.all([
    API.get('/api/returns'),
    API.get('/api/purchases')
  ]);

  const returns = retRes.returns || [];
  const purchases = (purRes.purchases || []).filter(p => p.status === 'APPROVED');
  const isAdminOrAuditor = AppState.user.role === 'admin' || AppState.user.role === 'auditor';

  main.innerHTML = `
    <div class="top-bar">
      <div>
        <h1 class="page-title">${t('returns_title')}</h1>
        <p style="font-size:13px;color:var(--text-muted)">
          ${t('returns_subtitle')}
        </p>
      </div>
    </div>

    <!-- Section 1: Search Purchases to Process Return/Exchange -->
    <div class="card" style="margin-bottom:20px;border-left:4px solid var(--accent);">
      <div class="card-header" style="margin-bottom:12px;">
        <div>
          <div class="card-title">${t('search_purchases_return')}</div>
          <small style="color:var(--text-muted)">Find any approved bill by Customer Name, Mechanic Name, Phone, Address, or Bill ID</small>
        </div>
      </div>

      <div class="form-group" style="margin-bottom:14px;">
        <input 
          type="text" 
          id="return-search-input" 
          placeholder="${t('search_purchases_placeholder')}" 
          style="font-size:15px;padding:12px 14px;border:2px solid var(--border-focus);"
          oninput="filterReturnsPurchases(this.value)"
          autofocus
        >
      </div>

      <div class="table-responsive">
        <table id="return-search-table">
          <thead>
            <tr>
              <th>Bill ID</th>
              <th>${t('date')}</th>
              <th>${t('customer')}</th>
              <th>${t('role_mechanic')}</th>
              <th>${t('items')}</th>
              <th>${t('amount')}</th>
              <th>${t('points')}</th>
              <th>${t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            ${purchases.length === 0 ? `
              <tr><td colspan="8" style="text-align:center;padding:24px;color:var(--text-muted);">No approved purchases found to process returns.</td></tr>
            ` : purchases.map(p => {
              const itemSummary = (p.items || []).map(i => `${i.product_name} (${i.quantity} ${i.unit})`).join(', ') || 'General purchase';
              const searchKey = `${p.id} ${p.customer_name} ${p.customer_phone || ''} ${p.customer_address || ''} ${p.mechanic_name} ${p.mechanic_phone || ''} ${p.trade_type || ''} ${itemSummary}`.toLowerCase();
              return `
                <tr data-search="${searchKey}" class="return-purchase-row">
                  <td><b style="font-size:14px;color:var(--primary);">#${p.id}</b></td>
                  <td>${p.purchase_date}</td>
                  <td>
                    <b>${p.customer_name}</b><br>
                    <small style="color:var(--text-muted)">${p.customer_phone || 'No phone'}</small>
                    ${p.customer_address ? `<br><small style="color:var(--text-muted)">📍 ${p.customer_address}</small>` : ''}
                  </td>
                  <td>
                    <b>${p.mechanic_name}</b><br>
                    <span class="badge" style="background:#E0F2FE;color:#0284C7;font-size:11px;">${p.trade_type || 'Worker'}</span>
                    <small style="color:var(--text-muted);">${p.mechanic_phone ? ` · 📞 ${p.mechanic_phone}` : ''}</small>
                  </td>
                  <td><small>${itemSummary}</small></td>
                  <td><b style="font-size:14px;color:var(--primary);">${formatINR(p.total_amount)}</b></td>
                  <td><b style="color:var(--success);">+${p.points_awarded || 0} pts</b></td>
                  <td>
                    <button class="btn btn-primary btn-sm" onclick="navigate('process_return', ${p.id})" style="white-space:nowrap;">
                      ↩️ Process Return / Exchange ➔
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Section 2: Processed Returns & Adjustments Audit Log -->
    <div class="card">
      <div class="card-header" style="margin-bottom:12px;">
        <div>
          <div class="card-title">📜 Processed Returns & Points Reversal History (${returns.length})</div>
          <small style="color:var(--text-muted)">Complete log of all customer returns, replacements, points debits/credits, and worker recovery</small>
        </div>
      </div>

      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Bill ID</th>
              <th>Referenced Worker</th>
              <th>Customer</th>
              <th>Returned Items</th>
              <th>Replacement Items</th>
              <th>Net Bill</th>
              <th>Points Change</th>
              <th>Recovery Pending</th>
              <th>Reason</th>
              <th>Processed By</th>
              <th>Worker Alert</th>
            </tr>
          </thead>
          <tbody>
            ${returns.length === 0 ? `
              <tr><td colspan="12" style="text-align:center;padding:24px;color:var(--text-muted);">No product returns recorded yet.</td></tr>
            ` : returns.map(r => `
              <tr>
                <td>${r.return_date}</td>
                <td>
                  <a onclick="navigate('process_return', ${r.purchase_id})" style="font-weight:700;color:var(--accent);cursor:pointer;text-decoration:underline;">
                    #${r.purchase_id}
                  </a>
                </td>
                <td>
                  <b>${r.mechanic_name}</b><br>
                  <small style="color:var(--text-muted)">${r.trade_type || ''}</small>
                </td>
                <td>${r.customer_name}</td>
                <td>
                  <span style="color:var(--danger);font-weight:600;">${r.items_summary || '-'}</span>
                  ${r.returned_value > 0 ? `<br><small style="color:var(--danger)">(-${formatINR(r.returned_value)})</small>` : ''}
                </td>
                <td>
                  <span style="color:var(--success);font-weight:600;">${r.replacement_summary || '-'}</span>
                  ${r.replacement_value > 0 ? `<br><small style="color:var(--success)">(+${formatINR(r.replacement_value)})</small>` : ''}
                </td>
                <td><b>${formatINR(r.updated_net_amount || (r.original_amount - (r.returned_value || 0) + (r.replacement_value || 0)))}</b></td>
                <td>
                  ${r.points_change !== undefined && r.points_change !== null ? `
                    <b style="font-size:14px;color:${r.points_change > 0 ? 'var(--success)' : r.points_change < 0 ? 'var(--danger)' : 'var(--text-muted)'};">
                      ${r.points_change > 0 ? `+${r.points_change}` : r.points_change} pts
                    </b>
                  ` : `
                    <b style="color:var(--danger)">-${r.points_reversed} pts</b>
                  `}
                </td>
                <td>${r.points_under_recovery > 0 ? `<b style="color:var(--danger)">${r.points_under_recovery} pts</b>` : '<span style="color:var(--text-muted)">None</span>'}</td>
                <td>${r.reason}</td>
                <td><small style="color:var(--text-muted)">${r.processed_by || 'Admin'}</small></td>
                <td>
                  <button class="btn btn-secondary btn-sm" style="background:#DCFCE7;color:#166534;font-size:11px;padding:3px 8px;" onclick="triggerSendWorkerNotification(${r.purchase_id})">
                    💬 WhatsApp
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function filterReturnsPurchases(query) {
  const q = query.toLowerCase().trim();
  const rows = document.querySelectorAll('#return-search-table tbody .return-purchase-row');
  let matchCount = 0;
  rows.forEach(r => {
    const text = r.getAttribute('data-search') || '';
    const match = text.includes(q);
    r.style.display = match ? '' : 'none';
    if (match) matchCount++;
  });
}

/* =========================================================================
   PROCESS RETURN & REPLACEMENT PAGE (DEDICATED DETAIL VIEW)
   ========================================================================= */

async function renderProcessReturn(purchaseId) {
  const main = document.getElementById('main-content');
  
  const [purRes, prodsRes] = await Promise.all([
    API.get(`/api/purchases/${purchaseId}`),
    API.get('/api/products')
  ]);

  const p = purRes.purchase;
  const products = prodsRes.products || [];
  window._availableProductsForReturn = products;
  window._currentPurchaseForReturn = p;

  const items = p.items || [];
  const origAmount = Number(p.total_amount || 0);
  const origPoints = p.points_awarded !== null ? p.points_awarded : Math.round(origAmount * 3 / 100);

  main.innerHTML = `
    <div class="top-bar">
      <div>
        <div style="display:flex;gap:8px;margin-bottom:8px;flex-wrap:wrap;">
          <button class="btn btn-secondary btn-sm" onclick="navigate('returns')">← Back to Returns & Reversals</button>
          <button class="btn btn-secondary btn-sm" onclick="navigate('purchases')">🧾 Purchases Directory</button>
        </div>
        <div style="display:flex;align-items:center;gap:10px;margin-top:4px;flex-wrap:wrap;">
          <h1 class="page-title" style="margin:0;">↩️ Process Return / Replacement for Bill #${p.id}</h1>
          <span class="badge badge-approved">VERIFIED & APPROVED</span>
        </div>
        <p style="font-size:13px;color:var(--text-muted);margin-top:4px;">
          Adjust customer items, record replacements, and automatically recalculate points for referenced worker <b>${p.mechanic_name}</b>.
        </p>
      </div>
      <div class="top-actions">
        <a href="tel:${p.mechanic_phone}" class="btn btn-secondary btn-sm">📞 Call ${p.mechanic_name}</a>
        <a href="https://wa.me/91${p.mechanic_phone}" target="_blank" class="btn btn-secondary btn-sm" style="background:#DCFCE7;color:#166534;">💬 WhatsApp Worker</a>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:340px 1fr;gap:20px;align-items:start;" class="return-layout-grid">
      
      <!-- Left Column: Bill & Worker Summary Card -->
      <div>
        <div class="card" style="margin-bottom:16px;">
          <div class="card-title" style="margin-bottom:12px;">👤 Customer Details</div>
          <div style="font-size:14px;line-height:1.6;">
            <b>Name:</b> ${p.customer_name}<br>
            <b>Phone:</b> ${p.customer_phone || '<span style="color:var(--text-muted)">Not provided</span>'}<br>
            <b>Address:</b> ${p.customer_address || '<span style="color:var(--text-muted)">Not provided</span>'}<br>
            <b>Purchase Date:</b> ${p.purchase_date}
          </div>
        </div>

        <div class="card" style="margin-bottom:16px;">
          <div class="card-title" style="margin-bottom:12px;">👷 Referenced Worker</div>
          <div style="font-size:14px;line-height:1.6;">
            <b>Name:</b> <a onclick="navigate('mechanic_detail', ${p.mechanic_id})" style="color:var(--accent);font-weight:700;cursor:pointer;">${p.mechanic_name} ➔</a><br>
            <b>Trade:</b> ${p.trade_type || 'Worker'}<br>
            <b>User ID:</b> ${p.mechanic_uid}<br>
            <b>Phone:</b> ${p.mechanic_phone}<br>
            <div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border);">
              <b>Available Points:</b> <span id="worker-curr-points" style="color:var(--primary);font-weight:700;font-size:15px;">${p.available_points} pts</span><br>
              ${p.recovery_points > 0 ? `<b>Recovery Pending:</b> <span style="color:var(--danger);font-weight:700;">${p.recovery_points} pts</span><br>` : ''}
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-title" style="margin-bottom:12px;">🧾 Original Bill Details</div>
          <div style="font-size:14px;line-height:1.6;">
            <b>Bill Number:</b> #${p.id}<br>
            <b>Original Bill Amount:</b> <span style="font-size:16px;font-weight:700;color:var(--primary);">${formatINR(origAmount)}</span><br>
            <b>Points Awarded:</b> <span style="color:var(--success);font-weight:700;">+${origPoints} pts</span><br>
            ${p.bill_file_url ? `
              <div style="margin-top:12px;">
                <button class="btn btn-secondary btn-sm" style="width:100%;" onclick="openBillViewerModal('${p.bill_file_url}', ${p.id})">🖼️ View Uploaded Receipt</button>
              </div>
            ` : '<small style="color:var(--text-muted);display:block;margin-top:8px;">No bill photo attached</small>'}
          </div>
        </div>
      </div>

      <!-- Right Column: Interactive Return & Replacement Form -->
      <div>
        <form id="process-return-form" onsubmit="handleProcessReturnSubmit(event, ${p.id})">
          
          <!-- Block 1: Items to Return / Reverse -->
          <div class="card" style="margin-bottom:16px;">
            <div class="card-header" style="margin-bottom:8px;">
              <div>
                <div class="card-title" style="color:var(--danger);">↩️ 1. Items to Return / Reverse</div>
                <small style="color:var(--text-muted)">Select original items being returned by the customer and enter returned monetary value</small>
              </div>
            </div>

            ${items.length === 0 ? `
              <p style="font-size:13px;color:var(--text-muted);margin-bottom:10px;">No individual line items registered. Enter the total returned monetary value below:</p>
              <div class="form-group">
                <label>Returned Items Monetary Value (₹)</label>
                <input type="number" id="manual-return-val" min="0" step="any" placeholder="e.g. 500" oninput="recalculateReturnMath()">
              </div>
            ` : `
              <div id="return-items-list">
                ${items.map((it, idx) => {
                  const maxReturn = Math.max(0, it.quantity - (it.returned_quantity || 0));
                  return `
                    <div class="return-item-card" data-item-id="${it.id}">
                      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                        <div>
                          <b style="font-size:14px;color:var(--primary);">${it.product_name}</b>
                          <div style="font-size:12px;color:var(--text-muted);">
                            Billed Qty: <b>${it.quantity} ${it.unit}</b>
                            ${it.returned_quantity > 0 ? `· Already Returned: <span style="color:var(--danger);">${it.returned_quantity} ${it.unit}</span>` : ''}
                            · Remaining: <b>${maxReturn} ${it.unit}</b>
                          </div>
                        </div>
                      </div>

                      <div class="form-row">
                        <div class="form-group" style="margin-bottom:0;">
                          <label style="font-size:12px;">Return Quantity (${it.unit})</label>
                          <input 
                            type="number" 
                            class="ret-line-qty" 
                            min="0" 
                            max="${maxReturn}" 
                            step="any" 
                            value="0" 
                            placeholder="0" 
                            oninput="recalculateReturnMath()"
                          >
                        </div>
                        <div class="form-group" style="margin-bottom:0;">
                          <label style="font-size:12px;">Returned Monetary Value (₹)</label>
                          <input 
                            type="number" 
                            class="ret-line-val" 
                            min="0" 
                            step="any" 
                            placeholder="Value to deduct ₹" 
                            oninput="recalculateReturnMath()"
                          >
                        </div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>

              <div class="form-group" style="margin-top:12px;">
                <label style="font-size:12px;color:var(--text-muted);">Additional / General Returned Value (₹) (If any)</label>
                <input type="number" id="manual-return-val" min="0" step="any" placeholder="0" oninput="recalculateReturnMath()">
              </div>
            `}
          </div>

          <!-- Block 2: Replacement / Exchange Items (New Items Added) -->
          <div class="card" style="margin-bottom:16px;">
            <div class="card-header" style="margin-bottom:8px;">
              <div>
                <div class="card-title" style="color:var(--success);">🔄 2. Replacement / Exchange Items (New Items Added)</div>
                <small style="color:var(--text-muted)">If the customer exchanged returned items for new products, add replacement items below</small>
              </div>
              <button type="button" class="btn btn-secondary btn-sm" onclick="addReplacementItemRow()">+ Add Replacement Item</button>
            </div>

            <div id="replacement-items-container">
              <!-- Dynamic replacement rows will appear here -->
            </div>
            
            <p id="no-rep-msg" style="font-size:12px;color:var(--text-muted);font-style:italic;margin-top:4px;">
              No replacement items added yet. Click "+ Add Replacement Item" above if this is an exchange.
            </p>
          </div>

          <!-- Block 3: Real-Time Dynamic Net Bill & Points Calculator -->
          <div class="calc-summary-card">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:14px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;">📊 Real-Time Adjustment Breakdown</span>
              <span class="badge" style="background:rgba(255,255,255,0.2);color:#fff;font-size:11px;">Automatic Rate: 3 pts per ₹100</span>
            </div>

            <div class="calc-summary-grid">
              <div class="calc-summary-item">
                <span class="calc-summary-label">Original Bill</span>
                <span class="calc-summary-val neutral" id="calc-orig-amt">${formatINR(origAmount)}</span>
              </div>

              <div class="calc-summary-item">
                <span class="calc-summary-label">Returned Value (-)</span>
                <span class="calc-summary-val neg" id="calc-ret-val">- ₹0</span>
              </div>

              <div class="calc-summary-item">
                <span class="calc-summary-label">Replacement Value (+)</span>
                <span class="calc-summary-val pos" id="calc-rep-val">+ ₹0</span>
              </div>

              <div class="calc-summary-item">
                <span class="calc-summary-label">Updated Net Bill</span>
                <span class="calc-summary-val" id="calc-net-amt" style="color:#FBBF24;">${formatINR(origAmount)}</span>
              </div>
            </div>

            <div style="margin-top:14px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.15);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
              <div>
                <span style="font-size:12px;color:#94A3B8;">Worker Points Impact:</span>
                <div id="calc-points-change" style="font-size:20px;font-weight:800;color:#94A3B8;">0 Points</div>
              </div>
              <div style="text-align:right;">
                <span style="font-size:12px;color:#94A3B8;">Estimated New Worker Balance:</span>
                <div id="calc-new-balance" style="font-size:18px;font-weight:700;color:#38BDF8;">${p.available_points} Points</div>
              </div>
            </div>
            <div id="calc-recovery-notice" style="display:none;margin-top:8px;font-size:12px;color:#FCA5A5;background:rgba(220,38,38,0.2);padding:6px 10px;border-radius:4px;"></div>
          </div>

          <!-- Block 4: Reason & Confirmation Submit -->
          <div class="card" style="margin-top:16px;">
            <div class="form-group">
              <label>Reason for Return / Replacement / Point Adjustment <span style="color:var(--danger)">*</span></label>
              <textarea 
                id="return-reason" 
                rows="3" 
                required 
                placeholder="e.g. Customer returned 2 defective pipes, exchanged with heavy duty fittings, difference adjusted in bill..."
              ></textarea>
            </div>

            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;flex-wrap:wrap;gap:12px;">
              <button type="button" class="btn btn-secondary" onclick="navigate('returns')">Cancel</button>
              <button type="submit" class="btn btn-primary btn-lg" id="submit-return-btn">
                💾 Process Return & Adjust Points
              </button>
            </div>
          </div>

        </form>
      </div>

    </div>
  `;
}

function addReplacementItemRow() {
  const container = document.getElementById('replacement-items-container');
  const noMsg = document.getElementById('no-rep-msg');
  if (noMsg) noMsg.style.display = 'none';
  if (!container) return;

  const rowId = 'rep_row_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
  const products = window._availableProductsForReturn || [];

  const div = document.createElement('div');
  div.id = rowId;
  div.className = 'rep-item-card';
  div.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
      <b style="font-size:13px;color:var(--success);">✨ New Replacement Item</b>
      <button type="button" class="btn btn-danger btn-sm" style="padding:2px 6px;font-size:11px;" onclick="removeReplacementRow('${rowId}')">✕ Remove</button>
    </div>
    
    <div class="form-row" style="margin-bottom:8px;">
      <div style="flex:2;">
        <label style="font-size:11px;font-weight:600;">Product Name / Item</label>
        <input type="text" class="rep-prod-name" placeholder="Item Name (e.g. 1-inch Brass Valve)" list="rep-prods-list" required oninput="recalculateReturnMath()">
        <datalist id="rep-prods-list">
          ${products.map(pr => `<option value="${pr.name}">${pr.category || ''} (${pr.unit})</option>`).join('')}
        </datalist>
      </div>
      <div style="flex:1;">
        <label style="font-size:11px;font-weight:600;">Quantity</label>
        <input type="number" class="rep-prod-qty" min="0" step="any" value="1" placeholder="Qty" oninput="recalculateReturnMath()">
      </div>
      <div style="flex:0.8;">
        <label style="font-size:11px;font-weight:600;">Unit</label>
        <input type="text" class="rep-prod-unit" value="Piece" placeholder="Unit">
      </div>
    </div>

    <div class="form-group" style="margin-bottom:0;">
      <label style="font-size:11px;font-weight:600;">Replacement Item Value (₹)</label>
      <input type="number" class="rep-prod-val" min="0" step="any" placeholder="Price of new item ₹" required oninput="recalculateReturnMath()">
    </div>
  `;

  container.appendChild(div);
  recalculateReturnMath();
}

function removeReplacementRow(rowId) {
  const el = document.getElementById(rowId);
  if (el) el.remove();
  const container = document.getElementById('replacement-items-container');
  const noMsg = document.getElementById('no-rep-msg');
  if (container && container.children.length === 0 && noMsg) {
    noMsg.style.display = 'block';
  }
  recalculateReturnMath();
}

function recalculateReturnMath() {
  const p = window._currentPurchaseForReturn;
  if (!p) return;

  const origAmount = Number(p.total_amount || 0);
  const currWorkerPts = Number(p.available_points || 0);

  // 1. Calculate Returned Monetary Value
  let totalReturnedVal = 0;
  const lineValInputs = document.querySelectorAll('.ret-line-val');
  lineValInputs.forEach(inp => {
    totalReturnedVal += parseFloat(inp.value) || 0;
  });
  const manualRet = parseFloat(document.getElementById('manual-return-val')?.value) || 0;
  totalReturnedVal += manualRet;

  // 2. Calculate Replacement Monetary Value
  let totalReplacementVal = 0;
  const repValInputs = document.querySelectorAll('.rep-prod-val');
  repValInputs.forEach(inp => {
    totalReplacementVal += parseFloat(inp.value) || 0;
  });

  // 3. Updated Net Bill Amount
  const updatedNetAmount = Math.max(0, origAmount - totalReturnedVal + totalReplacementVal);

  // 4. Net Points Change (Formula: net value difference * 3 points per ₹100)
  const netValueChange = totalReplacementVal - totalReturnedVal;
  let pointsChange = 0;
  if (totalReturnedVal > 0 || totalReplacementVal > 0) {
    pointsChange = Math.round(netValueChange * 3 / 100);
  }

  // 5. Worker points balance calculation
  let newBalance = currWorkerPts;
  let recoveryMsg = '';

  if (pointsChange < 0) {
    const toDeduct = Math.abs(pointsChange);
    if (toDeduct <= currWorkerPts) {
      newBalance = currWorkerPts - toDeduct;
    } else {
      newBalance = 0;
      const underRecovery = toDeduct - currWorkerPts;
      recoveryMsg = `⚠️ Deduction (${toDeduct} pts) exceeds available balance (${currWorkerPts} pts). Remaining ${underRecovery} pts will be marked for Recovery from future bills.`;
    }
  } else if (pointsChange > 0) {
    newBalance = currWorkerPts + pointsChange;
  }

  // Update UI Elements
  const elRet = document.getElementById('calc-ret-val');
  const elRep = document.getElementById('calc-rep-val');
  const elNet = document.getElementById('calc-net-amt');
  const elPts = document.getElementById('calc-points-change');
  const elBal = document.getElementById('calc-new-balance');
  const elRec = document.getElementById('calc-recovery-notice');

  if (elRet) elRet.textContent = `- ₹${totalReturnedVal.toLocaleString('en-IN')}`;
  if (elRep) elRep.textContent = `+ ₹${totalReplacementVal.toLocaleString('en-IN')}`;
  if (elNet) elNet.textContent = `₹${updatedNetAmount.toLocaleString('en-IN')}`;

  if (elPts) {
    if (pointsChange > 0) {
      elPts.textContent = `+${pointsChange} Points (Increment)`;
      elPts.style.color = '#4ADE80';
    } else if (pointsChange < 0) {
      elPts.textContent = `${pointsChange} Points (Decrement)`;
      elPts.style.color = '#F87171';
    } else {
      elPts.textContent = `0 Points (No change)`;
      elPts.style.color = '#94A3B8';
    }
  }

  if (elBal) {
    elBal.textContent = `${newBalance} Points`;
  }

  if (elRec) {
    if (recoveryMsg) {
      elRec.textContent = recoveryMsg;
      elRec.style.display = 'block';
    } else {
      elRec.style.display = 'none';
    }
  }
}

async function handleProcessReturnSubmit(e, purchaseId) {
  e.preventDefault();
  const btn = document.getElementById('submit-return-btn');

  // Collect returned line items
  const returnedItems = [];
  const retCards = document.querySelectorAll('.return-item-card');
  retCards.forEach(card => {
    const itemId = parseInt(card.getAttribute('data-item-id'), 10);
    const qty = parseFloat(card.querySelector('.ret-line-qty')?.value) || 0;
    const val = parseFloat(card.querySelector('.ret-line-val')?.value) || 0;
    if (qty > 0 || val > 0) {
      returnedItems.push({
        itemId,
        returnedQuantity: qty,
        returnedValue: val
      });
    }
  });

  // Collect replacement items
  const replacementItems = [];
  const repCards = document.querySelectorAll('.rep-item-card');
  repCards.forEach(card => {
    const name = card.querySelector('.rep-prod-name')?.value.trim();
    const qty = parseFloat(card.querySelector('.rep-prod-qty')?.value) || 1;
    const unit = card.querySelector('.rep-prod-unit')?.value.trim() || 'Piece';
    const price = parseFloat(card.querySelector('.rep-prod-val')?.value) || 0;
    if (name) {
      replacementItems.push({
        productName: name,
        quantity: qty,
        unit,
        price
      });
    }
  });

  // Calculate totals
  let returnedValue = 0;
  returnedItems.forEach(r => returnedValue += (r.returnedValue || 0));
  const manualRet = parseFloat(document.getElementById('manual-return-val')?.value) || 0;
  returnedValue += manualRet;

  let replacementValue = 0;
  replacementItems.forEach(r => replacementValue += (r.price || 0));

  const reason = document.getElementById('return-reason').value.trim();

  if (returnedItems.length === 0 && replacementItems.length === 0 && returnedValue <= 0 && replacementValue <= 0) {
    return showToast('Please enter return quantities/values or add replacement items', 'error');
  }

  if (!reason) {
    return showToast('Please provide a reason for the return / replacement', 'error');
  }

  btn.disabled = true;
  btn.textContent = 'Processing Return & Points Adjustment...';

  try {
    const payload = {
      returnedItems,
      replacementItems,
      returnedValue,
      replacementValue,
      reason
    };

    const res = await API.post(`/api/purchases/${purchaseId}/return`, payload);
    showToast('Return & points adjustment processed successfully!', 'success');

    // Automatically trigger WhatsApp and SMS notification popup for worker
    if (res.notification) {
      showWorkerNotificationModal(res.notification, () => {
        navigate('returns');
      });
    } else {
      navigate('returns');
    }
  } catch (err) {
    btn.disabled = false;
    btn.textContent = '💾 Process Return & Adjust Points';
  }
}


/* =========================================================================
   REWARDS & REDEMPTIONS VIEW
   ========================================================================= */

/* =========================================================================
   REWARDS & REDEMPTIONS VIEW & MANAGEMENT
/* =========================================================================
   REWARDS & REDEMPTIONS VIEW & MANAGEMENT (TRADE-TARGETED VISIBILITY)
   ========================================================================= */

async function renderRewardsView() {
  const main = document.getElementById('main-content');
  const rewRes = await API.get('/api/rewards');
  const rewards = rewRes.rewards || [];
  const isMechanic = AppState.user.role === 'mechanic';
  const isAdmin = AppState.user.role === 'admin';

  let mechPoints = 0;
  let mechTrade = 'Worker';
  if (isMechanic && AppState.user.mechanic) {
    mechPoints = AppState.user.mechanic.available_points || 0;
    mechTrade = AppState.user.mechanic.trade_type || 'General';
  }

  // Store rewards globally for admin preview filtering
  window._adminCatalogRewards = rewards;

  main.innerHTML = `
    <div class="top-bar">
      <div>
        <h1 class="page-title">${t('rewards_catalog_title')}</h1>
        <p style="font-size:13px;color:var(--text-muted)">
          ${isMechanic ? `
            ${t('your_balance')}: <b style="color:var(--primary);font-size:16px;">${mechPoints} pts</b> · ${t('trade_category')}: <span class="badge" style="background:#E0F2FE;color:#0284C7;font-weight:700;">${mechTrade}</span>
          ` : 'Configure rewards catalog, point values, inventory, and category-targeted visibility'}
        </p>
      </div>
      <div class="top-actions">
        ${isAdmin ? `<button class="btn btn-primary btn-sm" onclick="openAddRewardModal()">${t('add_reward_btn')}</button>` : ''}
      </div>
    </div>

    ${isAdmin ? `
      <!-- Admin Visibility Filter & Preview Bar -->
      <div class="card" style="margin-bottom:16px;padding:12px;">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">
          <div style="font-size:13px;font-weight:700;color:var(--primary);display:flex;align-items:center;gap:6px;">
            <span>${t('filter_by_category')}</span>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;" id="reward-filter-pills">
            <button class="btn btn-sm btn-primary pill-filter active" data-filter="ALL" onclick="filterAdminRewards('ALL')">${t('all')} (${rewards.length})</button>
            <button class="btn btn-sm btn-secondary pill-filter" data-filter="all_trades" onclick="filterAdminRewards('all_trades')">${t('visible_to_all')}</button>
            ${TRADE_TYPES.map(tr => {
              const count = rewards.filter(r => (r.eligible_types || []).includes('all') || (r.eligible_types || []).includes(tr)).length;
              return `<button class="btn btn-sm btn-secondary pill-filter" data-filter="${tr}" onclick="filterAdminRewards('${tr}')">${tr} (${count})</button>`;
            }).join('')}
          </div>
        </div>
      </div>
    ` : ''}

    <div id="rewards-grid-container" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px;">
      ${renderRewardsCardsHtml(rewards, isMechanic, isAdmin, mechPoints, mechTrade)}
    </div>
  `;
}

let uploadedRewardImageUrl = '';
let uploadedTargetProductImageUrl = '';

function handleTargetProductImageSelected(input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  const placeholder = document.getElementById('target-prod-img-placeholder');
  const previewDiv = document.getElementById('target-prod-img-preview');
  const previewImg = document.getElementById('target-prod-preview-img');

  if (placeholder) placeholder.innerHTML = `<p style="font-size:12px;color:var(--text-muted)">Uploading item photo...</p>`;

  reader.onload = async (e) => {
    const dataUrl = e.target.result;
    try {
      const res = await API.post('/api/upload', { dataUrl, filename: file.name });
      uploadedTargetProductImageUrl = res.fileUrl;
      if (previewImg) previewImg.src = uploadedTargetProductImageUrl;
      if (placeholder) placeholder.style.display = 'none';
      if (previewDiv) previewDiv.style.display = 'block';
      showToast('Item to sell photo uploaded', 'success');
    } catch (err) {
      if (placeholder) {
        placeholder.style.display = 'block';
        placeholder.innerHTML = `<p style="color:var(--danger);font-size:12px;">Upload failed: ${err.message}</p>`;
      }
    }
  };
  reader.readAsDataURL(file);
}

function removeTargetProductImage() {
  uploadedTargetProductImageUrl = '';
  const fileInput = document.getElementById('target-prod-file-input');
  if (fileInput) fileInput.value = '';
  const placeholder = document.getElementById('target-prod-img-placeholder');
  const previewDiv = document.getElementById('target-prod-img-preview');
  if (placeholder) {
    placeholder.style.display = 'block';
    placeholder.innerHTML = `
      <div style="font-size:28px;margin-bottom:4px;">📦</div>
      <div style="font-size:12px;font-weight:600;color:var(--accent);">Click to Upload Item to Sell Photo</div>
      <small style="color:var(--text-muted);font-size:11px;">(Optional) Supports PNG, JPG, WebP</small>
    `;
  }
  if (previewDiv) previewDiv.style.display = 'none';
}

function handleRewardImageSelected(input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  const placeholder = document.getElementById('reward-img-placeholder');
  const previewDiv = document.getElementById('reward-img-preview');
  const previewImg = document.getElementById('reward-preview-img');

  if (placeholder) placeholder.innerHTML = `<p style="font-size:12px;color:var(--text-muted)">Uploading reward photo...</p>`;

  reader.onload = async (e) => {
    const dataUrl = e.target.result;
    try {
      const res = await API.post('/api/upload', { dataUrl, filename: file.name });
      uploadedRewardImageUrl = res.fileUrl;
      if (previewImg) previewImg.src = uploadedRewardImageUrl;
      if (placeholder) placeholder.style.display = 'none';
      if (previewDiv) previewDiv.style.display = 'block';
      showToast('Reward prize photo uploaded', 'success');
    } catch (err) {
      if (placeholder) {
        placeholder.style.display = 'block';
        placeholder.innerHTML = `<p style="color:var(--danger);font-size:12px;">Upload failed: ${err.message}</p>`;
      }
    }
  };
  reader.readAsDataURL(file);
}

function removeRewardImage() {
  uploadedRewardImageUrl = '';
  const fileInput = document.getElementById('reward-file-input');
  if (fileInput) fileInput.value = '';
  const placeholder = document.getElementById('reward-img-placeholder');
  const previewDiv = document.getElementById('reward-img-preview');
  if (placeholder) {
    placeholder.style.display = 'block';
    placeholder.innerHTML = `
      <div style="font-size:28px;margin-bottom:4px;">🎁</div>
      <div style="font-size:12px;font-weight:600;color:var(--accent);">Click to Upload Reward Prize Photo</div>
      <small style="color:var(--text-muted);font-size:11px;">(Optional) Supports PNG, JPG, WebP</small>
    `;
  }
  if (previewDiv) previewDiv.style.display = 'none';
}

function renderRewardsCardsHtml(rewardsList, isMechanic, isAdmin, mechPoints, mechTrade) {
  if (!rewardsList || rewardsList.length === 0) {
    return `
      <div class="card" style="grid-column:1/-1;text-align:center;padding:48px;">
        <p style="font-size:15px;color:var(--text-muted);margin-bottom:12px;">
          ${isMechanic ? `No reward items are currently assigned to the "${mechTrade}" category.` : 'No rewards found matching this category filter.'}
        </p>
        ${isAdmin ? `<button class="btn btn-primary btn-sm" onclick="openAddRewardModal()">${t('add_reward_btn')}</button>` : ''}
      </div>
    `;
  }

  return rewardsList.map(r => {
    const isAll = (r.eligible_types || []).includes('all');
    const isEligible = isMechanic ? ((isAll || (r.eligible_types || []).includes(mechTrade)) && mechPoints >= r.points_required) : true;
    const hasTargetImg = !!r.target_product_image_url;
    const hasRewardImg = !!r.image_url;
    const hasTargetName = !!(r.target_product_name && r.target_product_name.trim());
    
    return `
      <div class="card reward-item-card" data-eligible='${JSON.stringify(r.eligible_types || ["all"])}' style="display:flex;flex-direction:column;justify-content:space-between;border-top:3px solid ${r.is_active ? 'var(--accent)' : 'var(--border)'};">
        <div>
          <!-- Dual-Image or Single-Image Display -->
          ${(hasTargetImg && hasRewardImg) ? `
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
              <div style="background:#F8FAFC;border:1px solid var(--border);border-radius:var(--radius-sm);padding:6px;text-align:center;">
                <div style="font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase;margin-bottom:4px;">${t('item_to_sell')}</div>
                <div style="height:105px;display:flex;align-items:center;justify-content:center;overflow:hidden;border-radius:4px;background:#fff;">
                  <img src="${r.target_product_image_url}" style="max-height:100%;max-width:100%;object-fit:contain;" alt="${r.target_product_name || 'Item to sell'}">
                </div>
                ${hasTargetName ? `<div style="font-size:11px;font-weight:600;color:var(--text);margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${r.target_product_name}">${r.target_product_name}</div>` : ''}
              </div>

              <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:var(--radius-sm);padding:6px;text-align:center;">
                <div style="font-size:10px;font-weight:700;color:#1E40AF;text-transform:uppercase;margin-bottom:4px;">${t('reward_gift')}</div>
                <div style="height:105px;display:flex;align-items:center;justify-content:center;overflow:hidden;border-radius:4px;background:#fff;">
                  <img src="${r.image_url}" style="max-height:100%;max-width:100%;object-fit:contain;" alt="${r.name}">
                </div>
                <div style="font-size:11px;font-weight:700;color:#1E40AF;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${r.name}">${r.name}</div>
              </div>
            </div>
          ` : (hasTargetImg || hasRewardImg) ? `
            <div class="reward-card-image-wrap" style="position:relative;">
              <img src="${hasRewardImg ? r.image_url : r.target_product_image_url}" class="reward-card-img" alt="${r.name}">
              <span style="position:absolute;top:6px;left:6px;font-size:10px;font-weight:700;padding:2px 6px;border-radius:3px;background:rgba(15,23,42,0.75);color:#fff;">
                ${hasRewardImg ? t('reward_gift') : t('item_to_sell')}
              </span>
            </div>
          ` : `
            <div class="reward-card-image-wrap">
              <div class="reward-card-fallback-icon">🎁</div>
            </div>
          `}

          ${hasTargetName && !(hasTargetImg && hasRewardImg) ? `
            <div style="background:#F1F5F9;border:1px solid #E2E8F0;border-radius:var(--radius-sm);padding:6px 10px;margin-bottom:10px;font-size:12px;color:var(--text);">
              <span style="font-weight:700;color:var(--text-muted);font-size:11px;text-transform:uppercase;display:block;">${t('on_selling')}</span>
              <b>${r.target_product_name}</b>
            </div>
          ` : ''}

          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
            <h3 style="font-size:16px;font-weight:700;color:var(--primary);margin:0;">${r.name}</h3>
            ${isAdmin ? `
              <span class="badge ${r.is_active ? 'badge-active' : 'badge-inactive'}">
                ${r.is_active ? t('active') : t('inactive')}
              </span>
            ` : ''}
          </div>
          
          <div style="margin:10px 0;">
            <span style="font-size:24px;font-weight:800;color:var(--accent);">${r.points_required.toLocaleString()}</span>
            <span style="font-size:13px;color:var(--text-muted);font-weight:600;margin-left:4px;">${t('points')}</span>
          </div>

          ${isAdmin ? `
            <div style="margin-top:8px;">
              ${isAll ? `
                <div style="font-size:12px;background:#DCFCE7;color:#166534;padding:8px 10px;border-radius:var(--radius-sm);border:1px solid #BBF7D0;">
                  <b>👁️ Visibility:</b> Visible to <b>ALL Trade Categories</b>
                </div>
              ` : `
                <div style="font-size:12px;background:#EFF6FF;color:#1D4ED8;padding:8px 10px;border-radius:var(--radius-sm);border:1px solid #BFDBFE;">
                  <b>👁️ Visible ONLY to:</b> <b>${(r.eligible_types || []).join(', ')}</b>
                  <div style="font-size:11px;color:#DC2626;margin-top:2px;font-weight:600;">🚫 Hidden from other trade workers</div>
                </div>
              `}
            </div>
          ` : `
            <div style="font-size:12px;color:var(--text-muted);background:#F8FAFC;padding:8px 10px;border-radius:var(--radius-sm);">
              <b>${t('eligible_label')}</b> ${isAll ? t('visible_to_all') : (r.eligible_types || []).join(', ')}
            </div>
          `}
        </div>

        <div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--border);">
          ${isMechanic ? `
            <button class="btn btn-primary" style="width:100%;" ${!isEligible ? 'disabled' : ''} onclick="handleRedeemRequest(${r.id}, '${r.name.replace(/'/g, "\\'")}')">
              ${mechPoints < r.points_required ? t('need_more_pts_msg', '', { pts: r.points_required - mechPoints }) : t('claim_reward')}
            </button>
          ` : `
            <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;">
              <div style="display:flex;gap:6px;">
                <button class="btn btn-secondary btn-sm" onclick="openEditRewardModal(${r.id}, '${r.name.replace(/'/g, "\\'")}', ${r.points_required}, '${(r.image_url || '').replace(/'/g, "\\'")}', ${JSON.stringify(r.eligible_types).replace(/"/g, '&quot;')}, '${(r.target_product_name || '').replace(/'/g, "\\'")}', '${(r.target_product_image_url || '').replace(/'/g, "\\'")}')">✏️ ${t('edit')}</button>
                <button class="btn btn-secondary btn-sm" onclick="toggleRewardActive(${r.id})">${r.is_active ? t('deactivate') : t('activate')}</button>
              </div>
              <button class="btn btn-danger btn-sm" onclick="deleteReward(${r.id}, '${r.name.replace(/'/g, "\\'")}')" title="${t('delete')}">🗑️</button>
            </div>
          `}
        </div>
      </div>
    `;
  }).join('');
}

function filterAdminRewards(category) {
  const allRewards = window._adminCatalogRewards || [];
  const pills = document.querySelectorAll('#reward-filter-pills .pill-filter');
  pills.forEach(p => {
    if (p.getAttribute('data-filter') === category) {
      p.className = 'btn btn-sm btn-primary pill-filter active';
    } else {
      p.className = 'btn btn-sm btn-secondary pill-filter';
    }
  });

  let filtered = [];
  if (category === 'ALL') {
    filtered = allRewards;
  } else if (category === 'all_trades') {
    filtered = allRewards.filter(r => (r.eligible_types || []).includes('all'));
  } else {
    filtered = allRewards.filter(r => (r.eligible_types || []).includes('all') || (r.eligible_types || []).includes(category));
  }

  const container = document.getElementById('rewards-grid-container');
  if (container) {
    container.innerHTML = renderRewardsCardsHtml(filtered, false, true, 0, 'Admin');
  }
}

// Modal: Add Reward Item (With 2 Image Options & Target Item to be Sold)
function openAddRewardModal() {
  uploadedRewardImageUrl = '';
  uploadedTargetProductImageUrl = '';
  const modalRoot = document.getElementById('modal-root');
  modalRoot.innerHTML = `
    <div class="modal-backdrop" onclick="closeModal()">
      <div class="modal-content" onclick="event.stopPropagation()" style="max-width:580px;">
        <div class="modal-header">
          <div class="card-title">🎁 Add New Reward Scheme</div>
          <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <form onsubmit="handleAddRewardSubmit(event)">
          
          <!-- Block 1: Item / Material to be Sold (Optional) -->
          <div style="background:#F8FAFC;border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px;margin-bottom:14px;">
            <div style="font-weight:700;font-size:13px;color:var(--primary);margin-bottom:8px;display:flex;align-items:center;gap:6px;">
              <span>📦 1. Target Item / Product to be Sold</span>
              <span style="font-size:11px;font-weight:normal;color:var(--text-muted);">(Optional)</span>
            </div>
            
            <div class="form-group" style="margin-bottom:10px;">
              <label style="font-size:12px;">Name of Item to be Sold (Optional)</label>
              <input type="text" id="new-reward-target-item" placeholder="e.g. 50 Bags ACC Cement, 200m CPVC Pipe, Berger WeatherCoat...">
            </div>

            <div class="form-group" style="margin-bottom:0;">
              <label style="font-size:12px;">Photo of Item to be Sold (Optional)</label>
              <div class="reward-image-upload-box" onclick="document.getElementById('target-prod-file-input').click()" style="cursor:pointer;">
                <input type="file" id="target-prod-file-input" accept="image/*" style="display:none;" onchange="handleTargetProductImageSelected(this)">
                <div id="target-prod-img-preview-container" style="text-align:center;padding:12px;border:2px dashed var(--border);border-radius:var(--radius-sm);background:#fff;transition:all 0.2s;">
                  <div id="target-prod-img-placeholder">
                    <div style="font-size:28px;margin-bottom:4px;">📦</div>
                    <div style="font-size:12px;font-weight:600;color:var(--accent);">Click to Upload Item to Sell Photo</div>
                    <small style="color:var(--text-muted);font-size:11px;">(Optional) Supports PNG, JPG, WebP</small>
                  </div>
                  <div id="target-prod-img-preview" style="display:none;position:relative;">
                    <img id="target-prod-preview-img" src="" style="max-height:130px;max-width:100%;border-radius:var(--radius-sm);object-fit:contain;box-shadow:var(--shadow-sm);">
                    <div style="margin-top:6px;">
                      <button type="button" class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); removeTargetProductImage();">✕ Change / Remove</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Block 2: Reward Gift / Prize -->
          <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:var(--radius-sm);padding:14px;margin-bottom:14px;">
            <div style="font-weight:700;font-size:13px;color:#1E40AF;margin-bottom:8px;display:flex;align-items:center;gap:6px;">
              <span>🎁 2. Reward Gift / Prize</span>
            </div>

            <div class="form-row">
              <div class="form-group" style="flex:2;margin-bottom:10px;">
                <label style="font-size:12px;">Reward Item Name <span style="color:var(--danger)">*</span></label>
                <input type="text" id="new-reward-name" required placeholder="e.g. Prestige Induction Cooktop, ₹1,000 Voucher...">
              </div>
              <div class="form-group" style="flex:1;margin-bottom:10px;">
                <label style="font-size:12px;">Points Required <span style="color:var(--danger)">*</span></label>
                <input type="number" id="new-reward-points" required min="1" placeholder="e.g. 500">
              </div>
            </div>

            <div class="form-group" style="margin-bottom:0;">
              <label style="font-size:12px;">Photo of Reward Gift / Prize (Optional)</label>
              <div class="reward-image-upload-box" onclick="document.getElementById('reward-file-input').click()" style="cursor:pointer;">
                <input type="file" id="reward-file-input" accept="image/*" style="display:none;" onchange="handleRewardImageSelected(this)">
                <div id="reward-img-preview-container" style="text-align:center;padding:12px;border:2px dashed #93C5FD;border-radius:var(--radius-sm);background:#fff;transition:all 0.2s;">
                  <div id="reward-img-placeholder">
                    <div style="font-size:28px;margin-bottom:4px;">🎁</div>
                    <div style="font-size:12px;font-weight:600;color:var(--accent);">Click to Upload Reward Prize Photo</div>
                    <small style="color:var(--text-muted);font-size:11px;">(Optional) Supports PNG, JPG, WebP</small>
                  </div>
                  <div id="reward-img-preview" style="display:none;position:relative;">
                    <img id="reward-preview-img" src="" style="max-height:130px;max-width:100%;border-radius:var(--radius-sm);object-fit:contain;box-shadow:var(--shadow-sm);">
                    <div style="margin-top:6px;">
                      <button type="button" class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); removeRewardImage();">✕ Change / Remove</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Visibility & Category Targeting -->
          <div class="form-group" style="margin-top:12px;">
            <label style="font-weight:700;font-size:13px;color:var(--primary);">👁️ Worker Visibility & Trade Targeting</label>
            <p style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">Choose which workers will see this reward in their mobile app catalog:</p>
            
            <div style="background:#F8FAFC;padding:12px;border-radius:var(--radius-sm);border:1px solid var(--border);">
              <label style="display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;cursor:pointer;margin-bottom:10px;">
                <input type="radio" name="add-reward-vis" value="all" checked onchange="toggleAddRewardVisMode('all')">
                <span>🌟 Visible to ALL Workers (Shown across all trade categories)</span>
              </label>
              
              <label style="display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;cursor:pointer;margin-bottom:6px;">
                <input type="radio" name="add-reward-vis" value="custom" onchange="toggleAddRewardVisMode('custom')">
                <span>🎯 Visible to SPECIFIC Trade Categories Only</span>
              </label>
              
              <div id="add-vis-categories-box" style="display:none;padding-top:10px;border-top:1px dashed var(--border);margin-top:8px;">
                <div style="font-size:11px;color:var(--text-muted);margin-bottom:6px;">
                  Check the categories that <b>CAN view</b> this reward:
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                  ${TRADE_TYPES.map(t => `
                    <label style="font-size:12px;display:flex;align-items:center;gap:6px;cursor:pointer;background:#fff;padding:6px 8px;border-radius:4px;border:1px solid var(--border);">
                      <input type="checkbox" class="add-trade-check" value="${t}"> <span>${t}</span>
                    </label>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>

          <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:20px;">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary" id="save-reward-btn">Save Reward Item</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function toggleAddRewardVisMode(mode) {
  const box = document.getElementById('add-vis-categories-box');
  if (box) {
    box.style.display = mode === 'custom' ? 'block' : 'none';
  }
}

async function handleAddRewardSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('save-reward-btn');
  const targetProductName = document.getElementById('new-reward-target-item') ? document.getElementById('new-reward-target-item').value.trim() : '';
  const name = document.getElementById('new-reward-name').value.trim();
  const pointsRequired = parseInt(document.getElementById('new-reward-points').value, 10);

  const visMode = document.querySelector('input[name="add-reward-vis"]:checked')?.value || 'all';
  let eligibleTypes = ['all'];

  if (visMode === 'custom') {
    const checked = Array.from(document.querySelectorAll('.add-trade-check:checked')).map(c => c.value);
    if (checked.length === 0) {
      return showToast('Please select at least one trade category or choose "Visible to ALL"', 'error');
    }
    eligibleTypes = checked;
  }

  if (!name || isNaN(pointsRequired) || pointsRequired <= 0) {
    return showToast('Please enter a valid reward name and required points', 'error');
  }

  btn.disabled = true;
  btn.textContent = 'Saving...';

  try {
    await API.post('/api/rewards', {
      name,
      pointsRequired,
      targetProductName,
      targetProductImageUrl: uploadedTargetProductImageUrl,
      imageUrl: uploadedRewardImageUrl,
      eligibleTypes
    });
    showToast(`Reward "${name}" added to catalog successfully!`, 'success');
    uploadedRewardImageUrl = '';
    uploadedTargetProductImageUrl = '';
    closeModal();
    renderRewardsView();
  } catch (err) {
    btn.disabled = false;
    btn.textContent = 'Save Reward Item';
  }
}

// Modal: Edit Reward Item (With 2 Image Options & Target Item to be Sold)
function openEditRewardModal(id, currentName, currentPoints, currentImageUrl, currentEligible, currentTargetName = '', currentTargetImgUrl = '') {
  uploadedRewardImageUrl = currentImageUrl || '';
  uploadedTargetProductImageUrl = currentTargetImgUrl || '';
  const modalRoot = document.getElementById('modal-root');
  let elig = currentEligible || ['all'];
  if (typeof elig === 'string') {
    try { elig = JSON.parse(elig); } catch(e) { elig = ['all']; }
  }
  const isAll = elig.includes('all');

  modalRoot.innerHTML = `
    <div class="modal-backdrop" onclick="closeModal()">
      <div class="modal-content" onclick="event.stopPropagation()" style="max-width:580px;">
        <div class="modal-header">
          <div class="card-title">✏️ Edit Reward Scheme</div>
          <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <form onsubmit="handleEditRewardSubmit(event, ${id})">
          
          <!-- Block 1: Item / Material to be Sold (Optional) -->
          <div style="background:#F8FAFC;border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px;margin-bottom:14px;">
            <div style="font-weight:700;font-size:13px;color:var(--primary);margin-bottom:8px;display:flex;align-items:center;gap:6px;">
              <span>📦 1. Target Item / Product to be Sold</span>
              <span style="font-size:11px;font-weight:normal;color:var(--text-muted);">(Optional)</span>
            </div>
            
            <div class="form-group" style="margin-bottom:10px;">
              <label style="font-size:12px;">Name of Item to be Sold (Optional)</label>
              <input type="text" id="edit-reward-target-item" value="${currentTargetName || ''}" placeholder="e.g. 50 Bags ACC Cement, 200m CPVC Pipe, Berger WeatherCoat...">
            </div>

            <div class="form-group" style="margin-bottom:0;">
              <label style="font-size:12px;">Photo of Item to be Sold (Optional)</label>
              <div class="reward-image-upload-box" onclick="document.getElementById('target-prod-file-input').click()" style="cursor:pointer;">
                <input type="file" id="target-prod-file-input" accept="image/*" style="display:none;" onchange="handleTargetProductImageSelected(this)">
                <div id="target-prod-img-preview-container" style="text-align:center;padding:12px;border:2px dashed var(--border);border-radius:var(--radius-sm);background:#fff;transition:all 0.2s;">
                  <div id="target-prod-img-placeholder" style="${currentTargetImgUrl ? 'display:none;' : 'display:block;'}">
                    <div style="font-size:28px;margin-bottom:4px;">📦</div>
                    <div style="font-size:12px;font-weight:600;color:var(--accent);">Click to Upload Item to Sell Photo</div>
                    <small style="color:var(--text-muted);font-size:11px;">(Optional) Supports PNG, JPG, WebP</small>
                  </div>
                  <div id="target-prod-img-preview" style="${currentTargetImgUrl ? 'display:block;' : 'display:none;'}position:relative;">
                    <img id="target-prod-preview-img" src="${currentTargetImgUrl || ''}" style="max-height:130px;max-width:100%;border-radius:var(--radius-sm);object-fit:contain;box-shadow:var(--shadow-sm);">
                    <div style="margin-top:6px;">
                      <button type="button" class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); removeTargetProductImage();">✕ Change / Remove</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Block 2: Reward Gift / Prize -->
          <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:var(--radius-sm);padding:14px;margin-bottom:14px;">
            <div style="font-weight:700;font-size:13px;color:#1E40AF;margin-bottom:8px;display:flex;align-items:center;gap:6px;">
              <span>🎁 2. Reward Gift / Prize</span>
            </div>

            <div class="form-row">
              <div class="form-group" style="flex:2;margin-bottom:10px;">
                <label style="font-size:12px;">Reward Item Name <span style="color:var(--danger)">*</span></label>
                <input type="text" id="edit-reward-name" required value="${currentName}">
              </div>
              <div class="form-group" style="flex:1;margin-bottom:10px;">
                <label style="font-size:12px;">Points Required <span style="color:var(--danger)">*</span></label>
                <input type="number" id="edit-reward-points" required min="1" value="${currentPoints}">
              </div>
            </div>

            <div class="form-group" style="margin-bottom:0;">
              <label style="font-size:12px;">Photo of Reward Gift / Prize (Optional)</label>
              <div class="reward-image-upload-box" onclick="document.getElementById('reward-file-input').click()" style="cursor:pointer;">
                <input type="file" id="reward-file-input" accept="image/*" style="display:none;" onchange="handleRewardImageSelected(this)">
                <div id="reward-img-preview-container" style="text-align:center;padding:12px;border:2px dashed #93C5FD;border-radius:var(--radius-sm);background:#fff;transition:all 0.2s;">
                  <div id="reward-img-placeholder" style="${currentImageUrl ? 'display:none;' : 'display:block;'}">
                    <div style="font-size:28px;margin-bottom:4px;">🎁</div>
                    <div style="font-size:12px;font-weight:600;color:var(--accent);">Click to Upload Reward Prize Photo</div>
                    <small style="color:var(--text-muted);font-size:11px;">(Optional) Supports PNG, JPG, WebP</small>
                  </div>
                  <div id="reward-img-preview" style="${currentImageUrl ? 'display:block;' : 'display:none;'}position:relative;">
                    <img id="reward-preview-img" src="${currentImageUrl || ''}" style="max-height:130px;max-width:100%;border-radius:var(--radius-sm);object-fit:contain;box-shadow:var(--shadow-sm);">
                    <div style="margin-top:6px;">
                      <button type="button" class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); removeRewardImage();">✕ Change / Remove</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Visibility & Category Targeting -->
          <div class="form-group" style="margin-top:12px;">
            <label style="font-weight:700;font-size:13px;color:var(--primary);">👁️ Worker Visibility & Trade Targeting</label>
            <p style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">Choose which workers will see this reward in their mobile app catalog:</p>
            
            <div style="background:#F8FAFC;padding:12px;border-radius:var(--radius-sm);border:1px solid var(--border);">
              <label style="display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;cursor:pointer;margin-bottom:10px;">
                <input type="radio" name="edit-reward-vis" value="all" ${isAll ? 'checked' : ''} onchange="toggleEditRewardVisMode('all')">
                <span>🌟 Visible to ALL Workers (Shown across all trade categories)</span>
              </label>
              
              <label style="display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;cursor:pointer;margin-bottom:6px;">
                <input type="radio" name="edit-reward-vis" value="custom" ${!isAll ? 'checked' : ''} onchange="toggleEditRewardVisMode('custom')">
                <span>🎯 Visible to SPECIFIC Trade Categories Only</span>
              </label>
              
              <div id="edit-vis-categories-box" style="display:${!isAll ? 'block' : 'none'};padding-top:10px;border-top:1px dashed var(--border);margin-top:8px;">
                <div style="font-size:11px;color:var(--text-muted);margin-bottom:6px;">
                  Check the categories that <b>CAN view</b> this reward:
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                  ${TRADE_TYPES.map(t => `
                    <label style="font-size:12px;display:flex;align-items:center;gap:6px;cursor:pointer;background:#fff;padding:6px 8px;border-radius:4px;border:1px solid var(--border);">
                      <input type="checkbox" class="edit-trade-check" value="${t}" ${!isAll && elig.includes(t) ? 'checked' : ''}> <span>${t}</span>
                    </label>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>

          <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:20px;">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary" id="edit-reward-btn">Update Reward & Visibility</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function toggleEditRewardVisMode(mode) {
  const box = document.getElementById('edit-vis-categories-box');
  if (box) {
    box.style.display = mode === 'custom' ? 'block' : 'none';
  }
}

async function handleEditRewardSubmit(e, id) {
  e.preventDefault();
  const btn = document.getElementById('edit-reward-btn');
  const targetProductName = document.getElementById('edit-reward-target-item') ? document.getElementById('edit-reward-target-item').value.trim() : '';
  const name = document.getElementById('edit-reward-name').value.trim();
  const pointsRequired = parseInt(document.getElementById('edit-reward-points').value, 10);

  const visMode = document.querySelector('input[name="edit-reward-vis"]:checked')?.value || 'all';
  let eligibleTypes = ['all'];

  if (visMode === 'custom') {
    const checked = Array.from(document.querySelectorAll('.edit-trade-check:checked')).map(c => c.value);
    if (checked.length === 0) {
      return showToast('Please select at least one trade category or choose "Visible to ALL"', 'error');
    }
    eligibleTypes = checked;
  }

  btn.disabled = true;
  btn.textContent = 'Updating...';

  try {
    await API.patch(`/api/rewards/${id}`, {
      name,
      pointsRequired,
      targetProductName,
      targetProductImageUrl: uploadedTargetProductImageUrl,
      imageUrl: uploadedRewardImageUrl,
      eligibleTypes
    });
    showToast(`Reward "${name}" updated successfully!`, 'success');
    uploadedRewardImageUrl = '';
    uploadedTargetProductImageUrl = '';
    closeModal();
    renderRewardsView();
  } catch (err) {
    btn.disabled = false;
    btn.textContent = 'Update Reward & Visibility';
  }
}

async function deleteReward(rewardId, rewardName) {
  if (!confirm(`Are you sure you want to delete "${rewardName}" from the rewards catalog?`)) return;
  try {
    await apiFetch(`/api/rewards/${rewardId}`, { method: 'DELETE' });
    showToast(`Reward "${rewardName}" deleted`, 'success');
    renderRewardsView();
  } catch (err) {}
}

async function toggleRewardActive(rewardId) {
  try {
    const res = await API.patch(`/api/rewards/${rewardId}/toggle`, {});
    showToast(`Reward ${res.is_active ? 'activated' : 'deactivated'}`, 'success');
    renderRewardsView();
  } catch (err) {}
}

async function handleRedeemRequest(rewardId, rewardName) {
  if (!confirm(`Are you sure you want to claim "${rewardName}"? Points will be reserved immediately.`)) return;
  try {
    await API.post('/api/redemptions', { rewardId });
    showToast('Reward redemption requested!', 'success');
    navigate('redemptions');
  } catch (e) {}
}

/* =========================================================================
   AUDIT LOGS VIEW & CSV EXPORT
   ========================================================================= */

async function renderAuditLogsView() {
  const main = document.getElementById('main-content');
  const res = await API.get('/api/audit-logs');
  const logs = res.logs || [];

  main.innerHTML = `
    <div class="top-bar">
      <div>
        <h1 class="page-title">${t('audit_logs_title')}</h1>
        <p style="font-size:13px;color:var(--text-muted)">${t('audit_logs_sub')}</p>
      </div>
      <div class="top-actions">
        <a href="/api/audit-logs/export-csv" download class="btn btn-secondary btn-sm">${t('download_audit_csv')}</a>
      </div>
    </div>

    <div class="card" style="padding:0;">
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>${t('th_timestamp')}</th>
              <th>${t('th_actor')}</th>
              <th>${t('th_role')}</th>
              <th>${t('th_action')}</th>
              <th>${t('th_details')}</th>
              <th>${t('th_client_ip')}</th>
            </tr>
          </thead>
          <tbody>
            ${logs.length === 0 ? `<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text-muted);">${t('no_logs_found')}</td></tr>` : logs.map(l => `
              <tr>
                <td>#${l.id}</td>
                <td>${l.timestamp}</td>
                <td><b>${l.actor_name}</b></td>
                <td><span class="user-badge role-${l.actor_role}">${l.actor_role === 'admin' ? t('role_admin') : l.actor_role === 'auditor' ? t('role_auditor') : t('role_mechanic')}</span></td>
                <td><b>${l.action}</b></td>
                <td>${l.details}</td>
                <td><small style="color:var(--text-muted)">${l.ip_address}</small></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function openMobilePairingModal() {
  // Mobile pairing modal removed
}

// Fallback views for redemptions, settings, reports, mechanic dash
async function renderRedemptionsView() {
  const main = document.getElementById('main-content');
  const res = await API.get('/api/redemptions');
  const list = res.redemptions || [];
  const isAdmin = AppState.user.role === 'admin';

  main.innerHTML = `
    <div class="top-bar">
      <div>
        <h1 class="page-title">${t('redemptions_title')}</h1>
        <p style="font-size:13px;color:var(--text-muted)">${t('redemptions_sub')}</p>
      </div>
    </div>

    <div class="card" style="padding:0;">
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>${t('date')}</th>
              <th>${t('role_mechanic')}</th>
              <th>${t('th_reward')}</th>
              <th>${t('points')}</th>
              <th>${t('status')}</th>
              ${isAdmin ? `<th>${t('th_action')}</th>` : ''}
            </tr>
          </thead>
          <tbody>
            ${list.length === 0 ? `<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--text-muted);">${t('no_redemptions_found')}</td></tr>` : list.map(r => `
              <tr>
                <td>${r.requested_at}</td>
                <td><b>${r.mechanic_name}</b> (${r.trade_type})</td>
                <td>${r.reward_name}</td>
                <td><b>${r.points}</b></td>
                <td><span class="badge badge-${r.status.toLowerCase()}">${r.status === 'Approved' ? t('approved') : r.status === 'Pending' ? t('pending') : t('rejected')}</span></td>
                ${isAdmin ? `
                  <td>
                    ${r.status === 'Pending' ? `
                      <button class="btn btn-success btn-sm" onclick="decideRedemption(${r.id}, true)">${t('approved')}</button>
                      <button class="btn btn-danger btn-sm" onclick="decideRedemption(${r.id}, false)">${t('rejected')}</button>
                    ` : `Decided by ${r.decided_by || 'Admin'}`}
                  </td>
                ` : ''}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

async function decideRedemption(id, approve) {
  try {
    await API.post(`/api/redemptions/${id}/decide`, { approve });
    showToast(`Redemption ${approve ? 'approved' : 'rejected'}`, 'success');
    renderRedemptionsView();
  } catch (e) {}
}

async function renderMechanicDashboard() {
  const main = document.getElementById('main-content');
  const meRes = await API.get('/api/auth/me');
  const m = meRes.user.mechanic || {};
  const purRes = await API.get('/api/purchases');
  const purchases = purRes.purchases || [];

  main.innerHTML = `
    <div class="top-bar">
      <div>
        <h1 class="page-title">${t('worker_welcome')}, ${AppState.user.name}</h1>
        <p style="font-size:13px;color:var(--text-muted)">${m.trade_type || t('role_mechanic')} · ${t('user_id_label')}: ${m.uid || AppState.user.username}</p>
      </div>
      <div class="top-actions">
        <button class="btn btn-primary btn-sm" onclick="navigate('submit_purchase')">${t('submit_purchase_btn')}</button>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">${t('available_points')}</div>
        <div class="stat-value" style="color:var(--accent);">${m.available_points || 0}</div>
        <span style="font-size:11px;color:var(--text-muted)">${t('ready_for_redemption')}</span>
      </div>
      <div class="stat-card">
        <div class="stat-label">${t('lifetime_points')}</div>
        <div class="stat-value" style="color:var(--success);">${m.lifetime_points || 0}</div>
        <span style="font-size:11px;color:var(--text-muted)">${t('total_points_earned')}</span>
      </div>
      ${m.recovery_points > 0 ? `
        <div class="stat-card">
          <div class="stat-label">${t('recovery_pending')}</div>
          <div class="stat-value" style="color:var(--danger);">${m.recovery_points}</div>
          <span style="font-size:11px;color:var(--text-muted)">${t('deducted_future_bills')}</span>
        </div>
      ` : ''}
      <div class="stat-card">
        <div class="stat-label">${t('stat_approved_purchases')}</div>
        <div class="stat-value">${purchases.filter(p => p.status === 'APPROVED').length}</div>
        <span style="font-size:11px;color:var(--text-muted)">${t('nav_purchases')}</span>
      </div>
    </div>

    <div class="card">
      <div class="card-title" style="margin-bottom:12px;">${t('recent_purchases')}</div>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>${t('date')}</th>
              <th>${t('customer')}</th>
              <th>${t('items')}</th>
              <th>${t('amount')}</th>
              <th>${t('status')}</th>
              <th>${t('points')}</th>
            </tr>
          </thead>
          <tbody>
            ${purchases.slice(0, 5).map(p => `
              <tr>
                <td>${p.purchase_date}</td>
                <td>${p.customer_name}</td>
                <td>${(p.items || []).map(i => `${i.product_name} (${i.quantity} ${i.unit})`).join(', ')}</td>
                <td><b>${formatINR(p.total_amount)}</b></td>
                <td><span class="badge badge-${p.status.toLowerCase()}">${p.status}</span></td>
                <td><b>${p.points_awarded || '-'}</b></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

async function renderNotificationsView() {
  const main = document.getElementById('main-content');
  const res = await API.get('/api/notifications');
  const notifs = res.notifications || [];

  main.innerHTML = `
    <div class="top-bar">
      <h1 class="page-title">🔔 ${t('nav_notifications')}</h1>
    </div>
    <div class="card">
      ${notifs.length === 0 ? `<p style="color:var(--text-muted);">${t('loading').replace('...', '')}</p>` : notifs.map(n => `
        <div style="padding:10px 0;border-bottom:1px solid var(--border);">
          <div style="font-size:13px;">${n.message}</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">${n.created_at}</div>
        </div>
      `).join('')}
    </div>
  `;
}

async function renderReportsView() {
  const main = document.getElementById('main-content');
  const stats = await API.get('/api/dashboard/stats');
  const mechs = (await API.get('/api/mechanics')).mechanics || [];

  const leaderboard = [...mechs].sort((a, b) => b.lifetime_points - a.lifetime_points);

  main.innerHTML = `
    <div class="top-bar">
      <div>
        <h1 class="page-title">${t('reports_title')}</h1>
      </div>
      <div class="top-actions">
        <a href="/api/reports/export-purchases-csv" download class="btn btn-secondary btn-sm">${t('export_csv')}</a>
      </div>
    </div>

    <div class="card">
      <div class="card-title" style="margin-bottom:12px;">${t('top_mechanics_leaderboard')}</div>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>${t('full_name')}</th>
              <th>${t('trade_category')}</th>
              <th>${t('available_points')}</th>
              <th>${t('lifetime_points')}</th>
            </tr>
          </thead>
          <tbody>
            ${leaderboard.map((m, i) => `
              <tr>
                <td><b>#${i + 1}</b></td>
                <td><b>${m.name}</b> (${m.uid})</td>
                <td>${m.trade_type}</td>
                <td>${m.available_points}</td>
                <td><b style="color:var(--success);">${m.lifetime_points}</b></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

async function renderSettingsView() {
  const main = document.getElementById('main-content');
  const isAdmin = AppState.user && AppState.user.role === 'admin';
  const net = await API.get('/api/system/network-info');

  let waConfig = { enabled: false, phoneId: '', wabaId: '', maskedToken: '', hasToken: false, welcomeTemplate: '', billTemplate: '', redemptionTemplate: '' };
  if (isAdmin) {
    try {
      const waRes = await API.get('/api/admin/whatsapp/config');
      if (waRes && waRes.config) waConfig = waRes.config;
    } catch (e) {}
  }

  main.innerHTML = `
    <div class="top-bar">
      <div>
        <h1 class="page-title">⚙️ ${isAdmin ? t('settings_title') : t('system_settings_title')}</h1>
        <p style="font-size:13px;color:var(--text-muted)">
          ${isAdmin ? t('settings_subtitle') : t('system_settings_subtitle')}
        </p>
      </div>
    </div>

    <!-- Universal Language Preference Card for ALL Users -->
    <div class="card" style="margin-bottom:20px;max-width:720px;">
      <div class="card-header" style="border-bottom:1px solid var(--border);padding-bottom:12px;margin-bottom:16px;">
        <div>
          <div class="card-title" style="display:flex;align-items:center;gap:8px;">
            <span>🌐 ${t('language_preferences_title')}</span>
          </div>
          <p style="font-size:12px;color:var(--text-muted);margin-top:2px;">
            ${t('language_preferences_desc')}
          </p>
        </div>
      </div>

      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;background:#F8FAFC;padding:14px 16px;border-radius:var(--radius-sm);border:1px solid var(--border);">
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:24px;">🇮🇳</span>
          <div>
            <div style="font-size:14px;font-weight:700;color:var(--primary);">
              ${AppState.lang === 'hi' ? 'वर्तमान भाषा: हिन्दी' : 'Current Language: English'}
            </div>
            <small style="color:var(--text-muted);">${AppState.lang === 'hi' ? 'अंग्रेजी या हिन्दी में कभी भी बदलें' : 'Switch anytime between English and Hindi'}</small>
          </div>
        </div>

        <div style="display:flex;gap:8px;">
          <button type="button" class="btn ${AppState.lang !== 'hi' ? 'btn-primary' : 'btn-secondary'}" onclick="setLanguage('en')" style="font-weight:700;padding:8px 16px;">
            🇬🇧 English
          </button>
          <button type="button" class="btn ${AppState.lang === 'hi' ? 'btn-primary' : 'btn-secondary'}" onclick="setLanguage('hi')" style="font-weight:700;padding:8px 16px;">
            🇮🇳 हिन्दी (Hindi)
          </button>
        </div>
      </div>
    </div>

    ${isAdmin ? `
      <!-- Admin Credentials & Security Card -->
      <div class="card" style="margin-bottom:20px;max-width:720px;">
        <div class="card-header" style="border-bottom:1px solid var(--border);padding-bottom:12px;margin-bottom:16px;">
          <div>
            <div class="card-title" style="display:flex;align-items:center;gap:8px;">
              <span>🔐 ${t('admin_credentials_card')}</span>
            </div>
            <p style="font-size:12px;color:var(--text-muted);margin-top:2px;">
              Change your admin login username and password. Changes will take effect immediately.
            </p>
          </div>
        </div>

        <form onsubmit="handleAdminCredentialsSubmit(event)">
          <div class="form-row">
            <div class="form-group" style="flex:1;">
              <label>${t('admin_username')} <span style="color:var(--danger)">*</span></label>
              <input type="text" id="admin-username-input" value="${AppState.user.username || 'admin'}" required placeholder="e.g. admin or myusername" autocomplete="username">
              <small style="color:var(--text-muted);font-size:11px;">You will use this username (or your mobile number) to log in.</small>
            </div>
            <div class="form-group" style="flex:1;">
              <label>${t('admin_display_name')} <span style="color:var(--danger)">*</span></label>
              <input type="text" id="admin-name-input" value="${AppState.user.name || 'System Admin'}" required placeholder="e.g. Mahabir Admin" autocomplete="name">
            </div>
          </div>

          <div class="form-group">
            <label>${t('admin_contact_mobile')} <span style="color:var(--danger)">*</span></label>
            <input type="tel" id="admin-phone-input" value="${AppState.user.phone || ''}" placeholder="10-digit mobile number" pattern="[0-9]{10}" maxlength="10" minlength="10" inputmode="numeric" required autocomplete="tel">
            <small style="color:var(--text-muted);font-size:11px;">Mandatory 10-digit mobile number for administrator alerts and password resets.</small>
          </div>

          <div style="background:#F8FAFC;border:1px solid var(--border);border-radius:var(--radius-sm);padding:16px;margin:16px 0;">
            <div style="font-weight:700;font-size:13px;color:var(--primary);margin-bottom:4px;display:flex;align-items:center;gap:6px;">
              <span>🔑 ${t('change_admin_pw')}</span>
              <span style="font-size:11px;font-weight:normal;color:var(--text-muted);">(Leave empty if keeping current password)</span>
            </div>
            
            <div class="form-row" style="margin-top:12px;">
              <div class="form-group" style="flex:1;margin-bottom:0;">
                <label style="font-size:12px;">${t('new_pw')}</label>
                <div style="display:flex;gap:4px;">
                  <input type="password" id="admin-new-password" placeholder="Min 4 characters (or leave empty)" minlength="4" autocomplete="new-password">
                  <button type="button" class="btn btn-secondary btn-sm" onclick="togglePasswordVisibility('admin-new-password', this)" style="padding:4px 8px;">👁️</button>
                </div>
              </div>
              <div class="form-group" style="flex:1;margin-bottom:0;">
                <label style="font-size:12px;">${t('confirm_new_pw')}</label>
                <div style="display:flex;gap:4px;">
                  <input type="password" id="admin-confirm-password" placeholder="Re-enter new password" minlength="4" autocomplete="new-password">
                  <button type="button" class="btn btn-secondary btn-sm" onclick="togglePasswordVisibility('admin-confirm-password', this)" style="padding:4px 8px;">👁️</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Current Password Required For Security Verification -->
          <div style="background:#FEF3C7;border:1px solid #FCD34D;border-radius:var(--radius-sm);padding:14px;margin-bottom:16px;">
            <label style="font-size:13px;font-weight:700;color:#92400E;display:block;margin-bottom:6px;">
              🔒 ${t('current_pw')} <span style="color:var(--danger)">*</span> (Required to save changes)
            </label>
            <div style="display:flex;gap:4px;">
              <input type="password" id="admin-current-password" required placeholder="Enter current admin password" autocomplete="current-password" style="background:#fff;">
              <button type="button" class="btn btn-secondary btn-sm" onclick="togglePasswordVisibility('admin-current-password', this)" style="padding:4px 8px;">👁️</button>
            </div>
            <small style="color:#B45309;font-size:11px;display:block;margin-top:4px;">
              For security, please enter your existing password before modifying credentials.
            </small>
          </div>

          <div style="display:flex;justify-content:flex-end;gap:8px;">
            <button type="submit" class="btn btn-primary" id="save-admin-creds-btn" style="padding:10px 20px;">
              ${t('save_credentials_btn')}
            </button>
          </div>
        </form>
      </div>

      <!-- WhatsApp Meta Cloud API Configuration Card -->
      <div class="card" style="margin-bottom:20px;max-width:720px;">
        <div class="card-header" style="border-bottom:1px solid var(--border);padding-bottom:12px;margin-bottom:16px;">
          <div>
            <div class="card-title" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              <span>💬 Official WhatsApp Meta Cloud API Integration</span>
              <span class="badge ${waConfig.enabled ? 'badge-approved' : 'badge-inactive'}" style="font-size:11px;">
                ${waConfig.enabled ? '🟢 Auto-Dispatch Enabled' : '⚪ Disabled (wa.me Manual Mode)'}
              </span>
            </div>
            <p style="font-size:12px;color:var(--text-muted);margin-top:2px;">
              Directly send automated WhatsApp notifications to registered workers on registration, bill verification, and gift claims.
            </p>
          </div>
        </div>

        <form onsubmit="handleWhatsAppConfigSubmit(event)">
          <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:var(--radius-sm);padding:12px 14px;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
            <div>
              <div style="font-size:13px;font-weight:700;color:#166534;">Automated WhatsApp Server Dispatch</div>
              <small style="color:#15803D;font-size:11.5px;">When enabled, system will automatically send WhatsApp messages through Meta Graph API.</small>
            </div>
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;margin:0;font-weight:700;color:var(--primary);">
              <input type="checkbox" id="meta-wa-enabled" ${waConfig.enabled ? 'checked' : ''} style="width:18px;height:18px;cursor:pointer;">
              <span>Enable Meta API</span>
            </label>
          </div>

          <div class="form-row">
            <div class="form-group" style="flex:1;">
              <label>Phone Number ID <span style="color:var(--danger)">*</span></label>
              <input type="text" id="meta-wa-phone-id" value="${waConfig.phoneId || ''}" placeholder="e.g. 104829104819201" autocomplete="off">
              <small style="color:var(--text-muted);font-size:11px;">From Meta Developer App -> WhatsApp -> API Setup</small>
            </div>
            <div class="form-group" style="flex:1;">
              <label>WhatsApp Business Account ID (WABA ID)</label>
              <input type="text" id="meta-wa-waba-id" value="${waConfig.wabaId || ''}" placeholder="e.g. 193810293810293" autocomplete="off">
              <small style="color:var(--text-muted);font-size:11px;">Your WhatsApp Business Account ID</small>
            </div>
          </div>

          <div class="form-group">
            <label>Permanent System User Access Token <span style="color:var(--danger)">*</span></label>
            <input type="password" id="meta-wa-token" value="${waConfig.maskedToken || ''}" placeholder="${waConfig.hasToken ? 'Token configured (Enter new token only to update)' : 'EAAG... Paste Permanent Access Token'}" autocomplete="off">
            <small style="color:var(--text-muted);font-size:11px;">Generated from Meta Business Manager -> System Users with <code>whatsapp_business_messaging</code> permission.</small>
          </div>

          <!-- Message Templates (Optional) -->
          <div style="background:#F8FAFC;border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px;margin:16px 0;">
            <div style="font-weight:700;font-size:12.5px;color:var(--primary);margin-bottom:4px;">
              📋 Meta Approved Message Templates (Optional)
            </div>
            <p style="font-size:11.5px;color:var(--text-muted);margin-bottom:12px;">
              Leave empty to send direct standard text messages, or enter your approved Meta template names.
            </p>
            <div class="form-row">
              <div class="form-group" style="flex:1;margin-bottom:8px;">
                <label style="font-size:11px;">Welcome Template Name</label>
                <input type="text" id="meta-wa-template-welcome" value="${waConfig.welcomeTemplate || ''}" placeholder="e.g. worker_welcome_greeting">
              </div>
              <div class="form-group" style="flex:1;margin-bottom:8px;">
                <label style="font-size:11px;">Bill Credit Template Name</label>
                <input type="text" id="meta-wa-template-bill" value="${waConfig.billTemplate || ''}" placeholder="e.g. points_credit_alert">
              </div>
            </div>
          </div>

          <div style="display:flex;justify-content:flex-end;gap:8px;">
            <button type="submit" class="btn btn-primary" id="save-wa-config-btn">
              💾 Save WhatsApp API Settings
            </button>
          </div>
        </form>

        <!-- Live Meta WhatsApp API Test Tool -->
        <div style="margin-top:20px;padding-top:16px;border-top:1px solid var(--border);">
          <div style="font-size:13px;font-weight:700;color:var(--primary);margin-bottom:8px;display:flex;align-items:center;gap:6px;">
            <span>🧪 Live Connection Test</span>
            <span style="font-size:11px;font-weight:normal;color:var(--text-muted);">(Send instant test message to verify credentials)</span>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <input type="tel" id="meta-wa-test-phone" placeholder="10-digit mobile number to test" pattern="[0-9]{10}" maxlength="10" style="flex:1;min-width:200px;">
            <button type="button" class="btn btn-success" id="meta-wa-test-btn" onclick="handleWhatsAppTestSend()">
              🚀 Send Test WhatsApp
            </button>
          </div>
          <div id="meta-wa-test-result" style="margin-top:10px;font-size:12px;display:none;"></div>
        </div>
      </div>
    ` : ''}

    <!-- System & Network Info Card -->
    <div class="card" style="max-width:720px;">
      <div class="card-title" style="margin-bottom:12px;">💻 ${t('sys_net_info')}</div>
      <p style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">
        Local server network access details for Mahabir Traders Loyalty System.
      </p>
      <div style="background:#F1F5F9;padding:12px;border-radius:var(--radius-sm);font-family:monospace;font-size:14px;margin:12px 0;">
        ${t('primary_server_addr')}: <b>${net.primaryUrl || window.location.origin}</b>
      </div>
    </div>
  `;
}

async function handleAdminCredentialsSubmit(e) {
  e.preventDefault();
  const username = document.getElementById('admin-username-input').value.trim();
  const name = document.getElementById('admin-name-input').value.trim();
  const phone = document.getElementById('admin-phone-input').value.trim();
  const newPassword = document.getElementById('admin-new-password').value;
  const confirmPassword = document.getElementById('admin-confirm-password').value;
  const currentPassword = document.getElementById('admin-current-password').value;
  const btn = document.getElementById('save-admin-creds-btn');

  if (!username) {
    return showToast('Admin username cannot be empty', 'error');
  }

  const cleanPhone = phone.replace(/[^0-9]/g, '');
  if (!cleanPhone || cleanPhone.length !== 10) {
    return showToast('Admin mobile number is mandatory and must be exactly 10 digits', 'error');
  }

  if (newPassword && newPassword.length < 4) {
    return showToast('New password must be at least 4 characters long', 'error');
  }

  if (newPassword && newPassword !== confirmPassword) {
    return showToast('New password and confirm password do not match', 'error');
  }

  if (!currentPassword) {
    return showToast('Please enter your current password to authorize changes', 'error');
  }

  btn.disabled = true;
  btn.textContent = 'Saving Changes...';

  try {
    const res = await API.post('/api/admin/change-credentials', {
      currentPassword,
      newUsername: username,
      newName: name,
      newPhone: phone,
      newPassword: newPassword || undefined,
      confirmPassword: confirmPassword || undefined
    });

    if (res.user) {
      AppState.user.username = res.user.username;
      AppState.user.name = res.user.name;
      AppState.user.phone = res.user.phone;
    }

    showToast(res.message || 'Admin credentials updated successfully!', 'success');
    renderSidebar();
    renderSettingsView();
  } catch (err) {
    btn.disabled = false;
    btn.textContent = '💾 Save & Update Credentials';
  }
}

async function handleWhatsAppConfigSubmit(e) {
  e.preventDefault();
  const enabled = document.getElementById('meta-wa-enabled').checked;
  const phoneId = document.getElementById('meta-wa-phone-id').value.trim();
  const wabaId = document.getElementById('meta-wa-waba-id').value.trim();
  const token = document.getElementById('meta-wa-token').value.trim();
  const welcomeTemplate = document.getElementById('meta-wa-template-welcome').value.trim();
  const billTemplate = document.getElementById('meta-wa-template-bill').value.trim();
  const btn = document.getElementById('save-wa-config-btn');

  if (enabled && !phoneId) {
    return showToast('Please enter your Meta Phone Number ID', 'error');
  }

  btn.disabled = true;
  btn.textContent = 'Saving Settings...';

  try {
    const res = await API.post('/api/admin/whatsapp/config', {
      enabled,
      phoneId,
      wabaId,
      token: token || undefined,
      welcomeTemplate,
      billTemplate
    });
    showToast(res.message || 'WhatsApp Meta API configuration saved!', 'success');
    renderSettingsView();
  } catch (err) {
    btn.disabled = false;
    btn.textContent = '💾 Save WhatsApp API Settings';
  }
}

async function handleWhatsAppTestSend() {
  const phoneInput = document.getElementById('meta-wa-test-phone');
  const resultBox = document.getElementById('meta-wa-test-result');
  const btn = document.getElementById('meta-wa-test-btn');
  const phone = phoneInput ? phoneInput.value.trim().replace(/[^0-9]/g, '') : '';

  if (!phone || phone.length !== 10) {
    return showToast('Please enter a valid 10-digit mobile number to test', 'error');
  }

  btn.disabled = true;
  btn.textContent = '⏳ Sending...';
  if (resultBox) {
    resultBox.style.display = 'block';
    resultBox.style.background = '#EFF6FF';
    resultBox.style.color = '#1E40AF';
    resultBox.style.padding = '8px 12px';
    resultBox.style.borderRadius = 'var(--radius-sm)';
    resultBox.innerHTML = 'Connecting to Meta WhatsApp Cloud API...';
  }

  try {
    const res = await API.post('/api/admin/whatsapp/test', { testPhone: phone });
    btn.disabled = false;
    btn.textContent = '🚀 Send Test WhatsApp';
    if (resultBox) {
      resultBox.style.background = '#F0FDF4';
      resultBox.style.color = '#166534';
      resultBox.innerHTML = `✅ <b>Success!</b> Message dispatched to +91 ${phone}. (Meta ID: ${res.messageId || 'Delivered'})`;
    }
    showToast(`Test message sent successfully to +91 ${phone}!`, 'success');
  } catch (err) {
    btn.disabled = false;
    btn.textContent = '🚀 Send Test WhatsApp';
    if (resultBox) {
      resultBox.style.background = '#FEF2F2';
      resultBox.style.color = '#991B1B';
      resultBox.innerHTML = `❌ <b>Failed:</b> ${err.message || 'Could not deliver test message. Check Token & Phone ID.'}`;
    }
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', initApp);

