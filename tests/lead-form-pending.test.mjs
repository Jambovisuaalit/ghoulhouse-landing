import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTs } from './helpers/load-ts.mjs';

test('same-tick submit is ignored while pending; a failed request can be retried', async () => {
  const previousFetch=globalThis.fetch;
  const previousFormData=globalThis.FormData;
  let calls=0, resolveFetch;
  globalThis.FormData=class { entries(){ return Object.entries({service:'websites',intent:'booking'}); } };
  globalThis.fetch=()=>{ calls++; return new Promise(resolve=>{resolveFetch=resolve;}); };
  try {
    const {default:LeadForm}=loadTs('src/components/LeadForm.tsx',{
      react:{useState:value=>[value,()=>{}],useRef:value=>({current:value})},
      '@/lib/analytics':{trackEvent:()=>{}},
    });
    const form=LeadForm({mode:'proposal',defaultService:'websites'});
    const event={preventDefault(){},currentTarget:{elements:{namedItem(){return null;}}}};
    const first=form.props.onSubmit(event);
    await form.props.onSubmit(event);
    assert.equal(calls,1,'two submits before the disabled button renders must issue one request');
    resolveFetch({ok:false,json:async()=>({})});await first;
    const retry=form.props.onSubmit(event);
    assert.equal(calls,2,'after failure the user must be able to retry');
    resolveFetch({ok:false,json:async()=>({})});await retry;
  } finally {globalThis.fetch=previousFetch;globalThis.FormData=previousFormData;}
});
