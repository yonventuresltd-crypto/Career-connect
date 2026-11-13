import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const shots='screenshots';
const capture=async(page,name)=>{const toast=page.locator('.demo-toast');if(await toast.count())await toast.getByRole('button',{name:'Dismiss'}).click();await mkdir(shots,{recursive:true});await page.screenshot({path:`${shots}/${name}.png`,fullPage:true});};
const home=page=>page.getByRole('button',{name:'Career Connect home'});

test('school demo provides safe sample journeys and presentation screenshots', async ({ page }) => {
  const backendRequests=[];
  page.on('request',request=>{if(new URL(request.url()).hostname.endsWith('supabase.co'))backendRequests.push(request.url());});
  await page.goto('/');
  await expect(page.locator('input[type="file"]')).toHaveCount(0);
  await expect(page.getByRole('heading',{name:/Connect With Opportunities\./})).toBeVisible();
  await expect(page.getByText(/fictional data only/i)).toBeVisible();
  await capture(page,'01-home');

  await page.getByRole('button',{name:'Find Jobs',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Work that works for you.'})).toBeVisible();
  await capture(page,'02-jobs');
  await page.getByRole('button',{name:'Frontend Engineer',exact:true}).click();
  await expect(page.getByRole('button',{name:/Submit application/})).toBeDisabled();
  await capture(page,'03-job-detail-safe');
  await page.getByRole('button',{name:'Save sample job'}).click();
  await expect(page.getByRole('button',{name:'Saved in demo'})).toBeVisible();
  await page.getByRole('button',{name:/Report sample listing/}).click();
  await expect(page.getByText(/Sample report added/)).toBeVisible();

  await home(page).click();
  await page.getByRole('button',{name:'Enter job seeker demo'}).click();
  await expect(page.getByRole('heading',{name:'Good to see you, Ada.'})).toBeVisible();
  await expect(page.getByRole('button',{name:'CV upload disabled'})).toBeDisabled();
  await capture(page,'04-seeker-dashboard');
  await page.getByRole('button',{name:'Withdraw'}).click();
  await expect(page.getByText('Withdrawn',{exact:true})).toBeVisible();

  await home(page).click();
  await page.getByRole('button',{name:'Enter employer demo'}).click();
  await expect(page.getByRole('heading',{name:/Build a team that moves you forward/})).toBeVisible();
  await capture(page,'05-employer-dashboard');
  await page.getByRole('combobox',{name:'Update status for Ada Okafor'}).first().selectOption('shortlisted');
  await expect(page.locator('.demo-candidate-row').first().locator('.demo-status')).toHaveText('Shortlisted');
  await page.getByRole('button',{name:'Post sample job'}).click();
  await page.getByLabel('Job title').fill('Demo Product Designer');
  await page.getByLabel('Role overview').fill('Fictional role created for the school presentation.');
  await page.getByRole('button',{name:'Add to sample review queue'}).click();
  await expect(page.getByText('Demo Product Designer')).toBeVisible();
  await page.getByRole('button',{name:'Edit'}).first().click();
  await page.getByLabel('Job title').fill('Demo Product Designer Updated');
  await page.getByRole('button',{name:'Save sample changes'}).click();
  await expect(page.getByText('Demo Product Designer Updated')).toBeVisible();
  await page.getByRole('button',{name:'Close'}).first().click();
  await expect(page.locator('.demo-listing-row').filter({hasText:'Customer Success Associate'}).getByText('Closed')).toBeVisible();

  await home(page).click();
  await page.getByRole('button',{name:'Enter administrator demo'}).click();
  await expect(page.getByRole('heading',{name:'Care for the community.'})).toBeVisible();
  await capture(page,'06-admin-dashboard');
  await page.getByRole('button',{name:/Approve/}).first().click();
  await expect(page.getByText(/Sample listing approved/)).toBeVisible();
  await page.getByRole('button',{name:'Reviewed'}).first().click();
  await expect(page.getByText('Reviewed',{exact:true}).first()).toBeVisible();

  await page.getByRole('button',{name:'Exit demo'}).click();
  await page.setViewportSize({width:390,height:844});
  await page.reload(); // Reset all browser-memory sample mutations before the clean mobile capture.
  await capture(page,'07-mobile-home');
  expect(backendRequests).toEqual([]);
});
