# GradePilot — Semester SGPA Calculator

A responsive React + Vite calculator for a six-subject semester. It is ready to deploy on Vercel.

## Calculation used

For each subject:

- **CIE (25 marks):** `((CIE 1 + CIE 2 + CIE 3) / 3) / 30 × 25`
- **SEE (50 marks):** `SEE marks / 100 × 50`
- **Assignments (25 marks):** entered directly out of 25
- **Total:** CIE + SEE + assignments, out of 100

The app converts each subject total to a grade point using the editable default scale, then calculates:

`SGPA = Σ(credit × grade point) / Σ(credits)`

The default grade scale is a common 10-point scale and is editable in the app. Confirm the exact grade-point boundaries with your university regulations before relying on the result. This is a semester SGPA calculator; CGPA requires combining multiple semesters.

## Run locally

```bash
npm install
npm run dev
```

## Deploy to Vercel using GitHub

1. Create a new GitHub repository.
2. Upload/push the contents of this folder to the repository (the `package.json` must be at the repository root).
3. In Vercel, choose **Add New → Project** and import that GitHub repository.
4. Vercel should detect **Vite** automatically.
5. Keep the build command as `npm run build` and output directory as `dist`, then click **Deploy**.

Every push to the connected branch can trigger a new deployment.
