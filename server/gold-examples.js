// Gold standard HTML examples per screen archetype.
// These are few-shot references injected into the user message
// to show the AI what polished Avontus output looks like.
// Uses the project's pre-loaded CSS classes with realistic domain data.

export const GOLD_EXAMPLES = {
  'dashboard': `<div class="screen">
  <div class="app-bar">
    <span class="app-bar-title">Houston Branch</span>
    <button class="icon-btn"><span class="msi">notifications</span></button>
    <button class="icon-btn"><span class="msi">settings</span></button>
  </div>
  <div class="content">
    <div class="stat-group">
      <div class="stat-card"><span class="stat-label">Active</span><span class="stat-value">24</span></div>
      <div class="stat-card"><span class="stat-label">Ship Today</span><span class="stat-value teal">8</span></div>
      <div class="stat-card"><span class="stat-label">Overdue</span><span class="stat-value" style="color:var(--error,#D32F2F)">3</span></div>
      <div class="stat-card"><span class="stat-label">Revenue</span><span class="stat-value">$47.2k</span></div>
    </div>
    <p class="section-header">UPCOMING SHIPMENTS</p>
    <div class="card">
      <div class="list-item">
        <div class="list-icon"><span class="msi">local_shipping</span></div>
        <div class="col" style="flex:1">
          <div class="row-between"><span class="title-md">Johnson Construction</span><span class="badge badge-warning">Ship Today</span></div>
          <p class="body-sm" style="margin:2px 0">DEL-00756 · 24 pieces · 1,240 kg</p>
        </div>
        <button class="icon-btn"><span class="msi">chevron_right</span></button>
      </div>
      <div class="list-item">
        <div class="list-icon"><span class="msi">assignment</span></div>
        <div class="col" style="flex:1">
          <div class="row-between"><span class="title-md">Metro Tower Project</span><span class="badge badge-blue">Pending</span></div>
          <p class="body-sm" style="margin:2px 0">DEL-00761 · 18 pieces · 890 kg</p>
        </div>
        <button class="icon-btn"><span class="msi">chevron_right</span></button>
      </div>
    </div>
    <p class="section-header">RECENT ACTIVITY</p>
    <div class="card">
      <div class="list-item">
        <div class="list-icon" style="background:rgba(0,155,134,0.12)"><span class="msi" style="color:#009B86">check_circle</span></div>
        <div class="col" style="flex:1">
          <p class="body-md" style="margin:0">Return completed — SCF-4824</p>
          <p class="body-sm" style="margin:2px 0;opacity:0.6">Apex Builders · 2 hours ago</p>
        </div>
      </div>
    </div>
  </div>
</div>`,

  'list-browse': `<div class="screen">
  <div class="app-bar">
    <button class="icon-btn"><span class="msi">arrow_back</span></button>
    <span class="app-bar-title">Reservations</span>
    <button class="icon-btn"><span class="msi">search</span></button>
    <button class="icon-btn"><span class="msi">more_vert</span></button>
  </div>
  <div class="content">
    <div style="display:flex;gap:8px;padding:0 0 12px">
      <button class="chip active">All</button>
      <button class="chip">Pending</button>
      <button class="chip">Shipped</button>
      <button class="chip">Overdue</button>
    </div>
    <p class="section-header">THIS WEEK</p>
    <div class="card">
      <div class="list-item">
        <div class="list-icon"><span class="msi">assignment</span></div>
        <div class="col" style="flex:1">
          <div class="row-between"><span class="code">DEL-00756</span><span class="badge badge-warning">Pending</span></div>
          <p class="body-md" style="margin:2px 0">Johnson Construction</p>
          <p class="body-sm" style="margin:0;opacity:0.6">24 pieces · 1,240 kg · Ship by Mar 8</p>
        </div>
        <button class="icon-btn"><span class="msi">chevron_right</span></button>
      </div>
      <div class="list-item">
        <div class="list-icon"><span class="msi">assignment</span></div>
        <div class="col" style="flex:1">
          <div class="row-between"><span class="code">DEL-00761</span><span class="badge badge-teal">Shipped</span></div>
          <p class="body-md" style="margin:2px 0">Metro Tower Project</p>
          <p class="body-sm" style="margin:0;opacity:0.6">18 pieces · 890 kg · Shipped Mar 5</p>
        </div>
        <button class="icon-btn"><span class="msi">chevron_right</span></button>
      </div>
      <div class="list-item">
        <div class="list-icon"><span class="msi">assignment</span></div>
        <div class="col" style="flex:1">
          <div class="row-between"><span class="code">DEL-00748</span><span class="badge badge-error">Overdue</span></div>
          <p class="body-md" style="margin:2px 0">Apex Builders LLC</p>
          <p class="body-sm" style="margin:0;opacity:0.6">42 pieces · 2,100 kg · Due Mar 2</p>
        </div>
        <button class="icon-btn"><span class="msi">chevron_right</span></button>
      </div>
    </div>
    <p class="section-header">LAST WEEK</p>
    <div class="card">
      <div class="list-item">
        <div class="list-icon"><span class="msi">assignment</span></div>
        <div class="col" style="flex:1">
          <div class="row-between"><span class="code">DEL-00739</span><span class="badge badge-teal">Complete</span></div>
          <p class="body-md" style="margin:2px 0">Riverside Development</p>
          <p class="body-sm" style="margin:0;opacity:0.6">12 pieces · 620 kg · Returned Feb 28</p>
        </div>
        <button class="icon-btn"><span class="msi">chevron_right</span></button>
      </div>
    </div>
  </div>
</div>`,

  'form-input': `<div class="screen">
  <div class="app-bar">
    <button class="icon-btn"><span class="msi">close</span></button>
    <span class="app-bar-title">New Reservation</span>
    <button class="icon-btn"><span class="msi">check</span></button>
  </div>
  <div class="content">
    <p class="section-header">CUSTOMER</p>
    <div class="card" style="padding:16px;display:flex;flex-direction:column;gap:12px">
      <div class="text-field"><label class="field-label">Company</label><input type="text" class="field-input" placeholder="e.g., Johnson Construction"></div>
      <div class="text-field"><label class="field-label">Contact Name</label><input type="text" class="field-input" placeholder="e.g., Mike Johnson"></div>
      <div class="text-field"><label class="field-label">Jobsite Address</label><input type="text" class="field-input" placeholder="e.g., 1200 Main St, Houston"></div>
    </div>
    <p class="section-header">RESERVATION DETAILS</p>
    <div class="card" style="padding:16px;display:flex;flex-direction:column;gap:12px">
      <div class="row" style="gap:12px">
        <div class="text-field" style="flex:1"><label class="field-label">Ship Date</label><input type="text" class="field-input" placeholder="MM/DD/YYYY"></div>
        <div class="text-field" style="flex:1"><label class="field-label">Return Date</label><input type="text" class="field-input" placeholder="MM/DD/YYYY"></div>
      </div>
      <div class="text-field"><label class="field-label">Branch</label><div class="select-field">Houston Branch <span class="msi sm">expand_more</span></div></div>
    </div>
    <p class="section-header">NOTES</p>
    <div class="card" style="padding:16px">
      <div class="text-field"><label class="field-label">Special Instructions</label><textarea class="field-input" rows="3" placeholder="e.g., Deliver before 7 AM, gate code #4521"></textarea></div>
    </div>
  </div>
  <div class="bottom-actions">
    <button class="btn-outlined" style="flex:1">Cancel</button>
    <button class="btn-filled" style="flex:1">Create Reservation</button>
  </div>
</div>`,

  'detail-view': `<div class="screen">
  <div class="app-bar">
    <button class="icon-btn"><span class="msi">arrow_back</span></button>
    <span class="app-bar-title">DEL-00756</span>
    <button class="icon-btn"><span class="msi">edit</span></button>
    <button class="icon-btn"><span class="msi">more_vert</span></button>
  </div>
  <div class="content">
    <div class="card" style="padding:20px">
      <div class="row-between" style="margin-bottom:8px">
        <p class="title-lg" style="margin:0">Johnson Construction</p>
        <span class="badge badge-warning">Pending Ship</span>
      </div>
      <p class="body-sm" style="margin:0;opacity:0.6">1200 Main St, Houston TX · Mike Johnson</p>
      <div class="stat-group" style="margin-top:16px">
        <div class="stat-card"><span class="stat-label">Pieces</span><span class="stat-value">24</span></div>
        <div class="stat-card"><span class="stat-label">Weight</span><span class="stat-value">1,240 kg</span></div>
      </div>
    </div>
    <p class="section-header">EQUIPMENT</p>
    <div class="card">
      <div class="list-item">
        <div class="list-icon"><span class="msi">inventory_2</span></div>
        <div class="col" style="flex:1">
          <div class="row-between"><span class="body-md">Standard Frame 5×4</span><span class="body-md" style="font-weight:600">×12</span></div>
          <p class="body-sm" style="margin:0;opacity:0.6">SCF-4824 · 45 kg each</p>
        </div>
      </div>
      <div class="list-item">
        <div class="list-icon"><span class="msi">inventory_2</span></div>
        <div class="col" style="flex:1">
          <div class="row-between"><span class="body-md">Cross Brace 7ft</span><span class="body-md" style="font-weight:600">×8</span></div>
          <p class="body-sm" style="margin:0;opacity:0.6">SCF-2211 · 12 kg each</p>
        </div>
      </div>
      <div class="list-item">
        <div class="list-icon"><span class="msi">inventory_2</span></div>
        <div class="col" style="flex:1">
          <div class="row-between"><span class="body-md">Base Plate</span><span class="body-md" style="font-weight:600">×4</span></div>
          <p class="body-sm" style="margin:0;opacity:0.6">SCF-1005 · 8 kg each</p>
        </div>
      </div>
    </div>
    <p class="section-header">TIMELINE</p>
    <div class="card" style="padding:16px">
      <div class="row" style="gap:8px;margin-bottom:12px"><span class="msi sm" style="color:#009B86">check_circle</span><div class="col"><p class="body-md" style="margin:0">Created</p><p class="body-sm" style="margin:0;opacity:0.6">Mar 1, 2025 · Sarah K.</p></div></div>
      <div class="row" style="gap:8px"><span class="msi sm" style="color:#F9A825">schedule</span><div class="col"><p class="body-md" style="margin:0">Ship by Mar 8</p><p class="body-sm" style="margin:0;opacity:0.6">3 days remaining</p></div></div>
    </div>
  </div>
  <div class="bottom-actions">
    <button class="btn-filled" style="flex:1">Ship Reservation</button>
  </div>
</div>`,

  'settings': `<div class="screen">
  <div class="app-bar">
    <button class="icon-btn"><span class="msi">arrow_back</span></button>
    <span class="app-bar-title">Settings</span>
  </div>
  <div class="content">
    <p class="section-header">CONNECTION</p>
    <div class="card">
      <div class="list-item">
        <div class="list-icon"><span class="msi">dns</span></div>
        <div class="col" style="flex:1"><p class="body-md" style="margin:0">Server URL</p><p class="body-sm" style="margin:0;opacity:0.6">quantify.avontus.com</p></div>
        <button class="icon-btn"><span class="msi">chevron_right</span></button>
      </div>
      <div class="list-item">
        <div class="list-icon"><span class="msi">lock</span></div>
        <div class="col" style="flex:1"><p class="body-md" style="margin:0">Use SSL</p><p class="body-sm" style="margin:0;opacity:0.6">Encrypt all data in transit</p></div>
        <div class="toggle-switch active"></div>
      </div>
    </div>
    <p class="section-header">PREFERENCES</p>
    <div class="card">
      <div class="list-item">
        <div class="list-icon"><span class="msi">notifications</span></div>
        <div class="col" style="flex:1"><p class="body-md" style="margin:0">Push Notifications</p><p class="body-sm" style="margin:0;opacity:0.6">Shipment updates and alerts</p></div>
        <div class="toggle-switch active"></div>
      </div>
      <div class="list-item">
        <div class="list-icon"><span class="msi">dark_mode</span></div>
        <div class="col" style="flex:1"><p class="body-md" style="margin:0">Dark Mode</p><p class="body-sm" style="margin:0;opacity:0.6">Reduce eye strain in low light</p></div>
        <div class="toggle-switch"></div>
      </div>
      <div class="list-item">
        <div class="list-icon"><span class="msi">language</span></div>
        <div class="col" style="flex:1"><p class="body-md" style="margin:0">Language</p><p class="body-sm" style="margin:0;opacity:0.6">English (US)</p></div>
        <button class="icon-btn"><span class="msi">chevron_right</span></button>
      </div>
    </div>
    <p class="section-header">ACCOUNT</p>
    <div class="card">
      <div class="list-item">
        <div class="list-icon" style="background:rgba(211,47,47,0.12)"><span class="msi" style="color:#D32F2F">logout</span></div>
        <div class="col" style="flex:1"><p class="body-md" style="margin:0;color:#D32F2F">Sign Out</p><p class="body-sm" style="margin:0;opacity:0.6">sarah.k@avontus.com</p></div>
      </div>
    </div>
  </div>
</div>`,

  'login': `<div class="screen">
  <div class="content" style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100%;padding:32px 24px">
    <div style="text-align:center;margin-bottom:40px">
      <p class="headline" style="margin:0 0 4px;font-weight:700;color:#0005EE">Avontus</p>
      <p class="body-sm" style="margin:0;opacity:0.5;letter-spacing:0.1em;text-transform:uppercase">Quantify</p>
    </div>
    <div style="width:100%;max-width:320px;display:flex;flex-direction:column;gap:16px">
      <div class="text-field"><label class="field-label">Email</label><input type="email" class="field-input" placeholder="you@company.com"></div>
      <div class="text-field"><label class="field-label">Password</label><input type="password" class="field-input" placeholder="Enter password"></div>
      <button class="btn-filled" style="width:100%;margin-top:8px">Sign In</button>
      <p class="body-sm" style="text-align:center;margin:8px 0 0"><span class="link">Forgot password?</span></p>
    </div>
  </div>
</div>`,

  'empty-state': `<div class="screen">
  <div class="app-bar">
    <button class="icon-btn"><span class="msi">menu</span></button>
    <span class="app-bar-title">Reservations</span>
  </div>
  <div class="content" style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:70vh;text-align:center;padding:32px">
    <span class="msi" style="font-size:64px;color:#C5C7FA;margin-bottom:16px">assignment</span>
    <p class="title-lg" style="margin:0 0 8px">No reservations yet</p>
    <p class="body-md" style="margin:0 0 24px;opacity:0.6;max-width:280px">Create your first reservation to start tracking equipment shipments and returns.</p>
    <button class="btn-filled">Create Reservation</button>
  </div>
</div>`
}
