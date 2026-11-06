const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const products = [{ id:'nova', name:'Nova', tagline:'SaaS Landing Page', category:'Landing Pages', color:'#6366f1', layout:'saas' },{ id:'atelier', name:'Atelier', tagline:'Creative Portfolio', category:'Portfolio Templates', color:'#0f172a', layout:'portfolio' }]
function nav(n){ return '<nav class="navbar navbar-expand-lg navbar-dark" style="background:#0a0a0a;"><div class="container"><a class="navbar-brand fw-bold" href="#">'+n+'</a></div></nav>' }
function hero(n,t,c){ return '<section style="background:linear-gradient(135deg,'+c+',#0a0a0a);color:#fff;padding:60px 20px;text-align:center;"><div class="container"><h1 style="font-size:44px;font-weight:800;margin-bottom:10px;">'+n+'</h1><p style="font-size:18px;opacity:.9;margin-bottom:20px;">'+t+'</p></div></section>' }
function footer(n){ return '<footer style="background:#0a0a0a;color:#fff;padding:20px;text-align:center;"><p class="mb-0 small">&copy; 2026 ORBIT - '+n+'</p></footer>' }
function rep(n,fn){ var o=''; for(var i=0;i<n;i++) o+=fn(i); return o; }
const layouts = {}