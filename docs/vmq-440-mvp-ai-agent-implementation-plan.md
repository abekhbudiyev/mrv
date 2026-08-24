# VMQ-440 transport imtiyozlari AT: MVPni AI agent orqali ishlab chiqish rejasi

## 0. Hujjat pasporti

| Maydon | Qiymat |
|---|---|
| Status | Ishchi implementation plan |
| Qamrov | Kontingentdan tasdiqlangan claimni moliya ATiga topshirish va texnik ACK/NACK olishgacha |
| Asosiy normativ manba | O‘zbekiston Respublikasi Vazirlar Mahkamasining 2026-yil 13-avgustdagi 440-son qarori |
| Lex.uz | https://lex.uz/docs/8400823 |
| Kanonik loyiha spetsifikatsiyasi | `VMQ-440_transport_imtiyozlari_AT_spetsifikatsiyasi.md` |
| Kanonik spetsifikatsiya SHA-256 | `484bcd65b7af37c6d6bb40a039d15d6896df5dceecf6d01ade767bad51f71319` |
| Kanonik spetsifikatsiya hajmi | 1477 qator |
| Tartibning boshlanish sanasi | 2026-10-01 |
| Birinchi oktabr reyestrining eng kech topshirilishi | 2026-11-10 |
| MVPdan tashqari | Bank to‘lovini bajarish, post-payment status monitoringi va 2027-yil Social Card real-time payment |

Ushbu hujjat boshqa AI coding agent uchun bajariladigan texnik reja hisoblanadi.

Agent bu reja bilan kanonik spetsifikatsiya o‘rtasida tafovut topsa, kanonik spetsifikatsiyani ustun deb oladi, ishni to‘xtatadi va tafovutni aniq ko‘rsatadi.

Kanonik spetsifikatsiya o‘zgartirilmaydi.

## 1. Agentning bosh majburiyati

Agent quyidagi natijani ishlab chiqishi kerak:

> Versiyalangan huquqiy asos va policy, barcha tashuvchilar uchun umumiy atomar entitlement-ledger, real-time eligibility va rezerv, to‘liq ticket lifecycle, normativ dalillarga tayangan settlement, immutable claim, moliya ATiga idempotent handoff va tekshiriladigan audit iziga ega production-ready MVP.

Agent faqat frontend prototipni kengaytirib qo‘ymasligi kerak.

Natijada backend, DB, queue, fayl ombori, IAM, observability, migratsiya, testlar, role-based UI va integratsiya kontraktlari bo‘lishi shart.

## 2. MVP scope

### 2.1. MVPga kiradi

1. Versiyalangan ma’lumotnomalar registri.
2. Legal-basis va benefit-policy registri.
3. D-01…D-07 production gate registri.
4. Oltita manba idoradan kontingent snapshot va delta-event qabul qilish.
5. Shaxsni markaziy `person_id`ga moslashtirish.
6. Identity, citizenship/residency va hujjat amal muddatini tekshirish adapteri.
7. Qonuniy vakil vakolatini tekshirish.
8. Huquq tarixini valid-time va system-time bilan saqlash.
9. Policy engine orqali offerlar hisoblash.
10. Barcha tashuvchilar bo‘yicha global entitlement-ledger.
11. OUTBOUND va RETURN leglarini alohida yuritish.
12. Atomar `check-and-reserve`.
13. Reservation TTL, release, commit va lost-ACK recovery.
14. Principal–companion safar bog‘lanishi.
15. YAMIHda topilmagan shaxs uchun manual-verification case.
16. Bir martalik, opaque, server yaratadigan manual authorization.
17. Ticket issue, travelled, return, no-show, carrier-cancelled, void va reschedule oqimlari.
18. Ticket segment/coupon darajasidagi hisob.
19. Qaytarish sababi, dalili, deadline va vakolatli return-review.
20. Kunlik operatsion reconciliation.
21. Tashuvchining oylik settlement batch/reyestri.
22. Chipta nusxasi va yo‘nalish qaydnomasi kabi himoyalangan ilovalar.
23. Line-level settlement validatsiyasi.
24. Tasdiqlangan metodika mavjud bo‘lganda compensation hisoblash.
25. Qisman qabul, correction va resubmit.
26. ERI bilan imzolangan immutable claim versiyasi.
27. Aynan qabul qilingan claim versiyasini moliya ATiga yuborish.
28. Finance handoffning texnik ACK/NACK va retry holatini qayd qilish.
29. Audit, dalil paketi, hisobot va monitoring.
30. Manba idora va tashuvchilar uchun integratsiya sandboxi.

### 2.2. MVPning moliyaviy chegarasi

MVP quyidagi holatda tugaydi:

1. settlement line’lari tekshirilgan;
2. claim qabul qilingan yoki qisman qabul qilingan;
3. claimning immutable versiyasi va payload hashi mavjud;
4. vakolatli approver ERI bilan tasdiqlagan;
5. handoff aynan shu claim versiyasiga bog‘langan;
6. moliya ATiga idempotent yuborilgan;
7. moliya ATining texnik ACK yoki rad javobi yozilgan;
8. post-payment status listeneri ishga tushirilmagan; uning kanonik kontrakti keyingi bosqich uchun hujjatlashtirilgan.

Bankda mablag‘ o‘tkazish ushbu tizimning vazifasi emas.

### 2.3. MVPdan tashqari

- bank payment orderini bevosita bajarish;
- bank hisobvarag‘idan pul yechish yoki o‘tkazish;
- `PAYMENT_ORDER_CREATED`, `PROCESSING`, `PAID`, `REVERSED` kabi post-payment statuslarni runtime qabul qilish va UI’da monitoring qilish;
- tashuvchi inventari va joy tanlash;
- tashuvchining oddiy retail tarifini shakllantirish;
- tashuvchining PNR/order tizimini almashtirish;
- Social Card orqali 2027-yil real-time payment;
- Social Card refund/reversal moliyaviy mexanizmi;
- D-01…D-07 bo‘yicha tasdiqlanmagan biznes qoidani taxmin qilish;
- VMQ-440 transport scope’idan tashqari onkologik/gematologik bemorlar oqimi;
- nogironlik bandligi yoki davlat ijtimoiy sug‘urtasi modullari;
- rasmiy vakolatsiz operatorning vaqtinchalik huquq yaratishi.

## 3. Asosiy dizayn prinsiplari

### 3.1. Umumlashtirish

Quyidagilar yaratilmaydi:

- har bir manba tashkilot uchun alohida kontingent API;
- har bir toifa uchun alohida jadval;
- har bir transport uchun alohida eligibility servisi;
- har bir tashuvchi uchun alohida ticket jadvali;
- issue, return va travelled uchun takroriy strukturali jadvallar;
- select qiymatlarini Vue yoki backend fayllariga sochib hardcode qilish.

Farqlar quyidagilar orqali boshqariladi:

- `organization_id` va authenticated client claim;
- `legal_basis_code`;
- `benefit_policy_version_id`;
- `transport_mode_code`;
- `event_type`;
- `settlement_basis_code`;
- versiyalangan reference entry;
- versiyalangan JSON Schema.

### 3.2. Haddan tashqari umumlashtirmaslik

Quyidagi aggregate’lar typed model va alohida jadvallarga ega bo‘ladi:

- person va identity;
- legal entitlement;
- benefit account va ledger;
- reservation;
- eligibility decision;
- manual case;
- ticket va segment;
- settlement va claim;
- payment handoff;
- audit.

Generic EAV jadval biznes invariantlari o‘rnida ishlatilmaydi.

### 3.3. Source of truth

- huquq — vakolatli manba idora eventlari va YAMIH registry;
- benefit qarori — published policy revision;
- limit — PostgreSQLdagi entitlement-ledger;
- ticket holati — YAMIHdagi kanonik ticket aggregate;
- claim — imzolangan immutable claim version;
- bank/to‘lov natijasi — tashqi moliya ATidan kelgan status;
- UI xotirasi, Redis yoki queue ledger uchun source of truth emas.

### 3.4. Fail-closed

Quyidagi holatlarda production operatsiya rad qilinadi yoki manual case’ga o‘tadi:

- majburiy authoritative source mavjud emas;
- source ma’lumoti ruxsat etilgan freshnessdan eski;
- policy effective emas;
- kerakli D-gate ochiq;
- hujjat chipta yoki safar sanasida yaroqsiz;
- idempotency key boshqa payload bilan qayta ishlatilgan;
- reservation tugagan;
- settlement-basis tasdiqlanmagan;
- ERI tekshiruvdan o‘tmagan.

## 4. Maqsadli arxitektura

### 4.1. MVP deployment modeli

MVP modular monolith sifatida quriladi.

Sabablar:

- entitlement reserve va ledger debit bitta atomar DB tranzaksiyasini talab qiladi;
- jamoa va muddat cheklangan;
- distributed transaction xavfi kamayadi;
- modul chegaralari keyinchalik servisga ajratish uchun saqlanadi.

### 4.2. Tavsiya etilgan stack

| Qatlam | Texnologiya |
|---|---|
| Web | Mavjud Vue 3, TypeScript, Pinia, Vue Router |
| API | NestJS, Fastify adapter, TypeScript |
| Worker | NestJS standalone worker yoki umumiy domain package’dan foydalanuvchi TypeScript worker |
| DB | PostgreSQL HA |
| DB access | Drizzle ORM va raw SQL migration |
| IAM | Keycloak/OIDC; tizimlararo client credentials |
| Gateway | Tashkilot standarti bo‘yicha Kong yoki NGINX |
| Service authentication | mTLS + OAuth2/JWT |
| Queue | RabbitMQ, DLQ bilan |
| Cache/rate limit | Redis |
| File storage | S3-compatible MinIO yoki tashkilot obyekt ombori |
| Audit archive | Object Lock/WORM yoqilgan obyekt ombori |
| Telemetry | OpenTelemetry |
| Metrics | Prometheus + Grafana |
| Logs | Loki yoki tashkilot SIEM/log platformasi |
| Traces | Tempo/Jaeger |

Tashkilotda majburiy backend stack mavjud bo‘lsa, agent kod yozishdan oldin mos kelmaslikni ADRda qayd etadi va yo‘nalish so‘raydi.

### 4.3. Deployment birliklari

```text
source systems / carriers
          |
          v
integration platform / API gateway
          |
          v
      core-api
          |
          +---- PostgreSQL
          +---- Redis
          +---- Object storage
          +---- transactional outbox
                       |
                       v
                 RabbitMQ ---- async-worker
                                      |
                                      +---- finance adapter
                                      +---- reconciliation
                                      +---- expiry jobs
                                      +---- report projections
```

### 4.4. Backend modullari

| Modul | Egalik qiladigan obyektlar |
|---|---|
| `access-control` | principal, role mapping, permission policy, purpose |
| `reference-data` | catalog, entry, revision, relation, approval |
| `policy-engine` | policy, condition, benefit, priority, compiled snapshot |
| `party-identity` | person, identifier, document, residency verification, representative link |
| `beneficiary-registry` | source event, source record, legal entitlement, category assignment, quarantine |
| `historical-usage` | import, line, checksum, reconciliation, sign-off |
| `entitlement-ledger` | account, bundle, leg, ledger entry |
| `eligibility` | request, decision, offer, reason snapshot |
| `reservation` | hold, TTL, commit, release, authorization snapshot |
| `manual-cases` | case, document, decision, authorization token |
| `ticketing` | ticket, passenger, segment, event, fare, evidence, reschedule |
| `return-review` | return evidence, deadline, reviewer decision, restoration |
| `reconciliation` | operational and financial exception case |
| `settlement` | period, batch, line, validation, attachment |
| `claim` | immutable claim version, signature, status history |
| `payment-handoff` | handoff request, delivery, external status, allocation |
| `audit-reporting` | append-only audit, evidence package, reporting projection |
| `integration-operations` | inbox, outbox, operation, delivery, client, certificate |

Har bir modul boshqa modul jadvalini bevosita yozmaydi.

Cross-module mutation application service va aniq transaction boundary orqali amalga oshadi.

## 5. Target repository layout

```text
apps/
  web/
    src/
      core/
      features/transport-benefits/
        api/generated/
        components/
        composables/
        pages/
        stores/
        access/
  api/
    src/
      bootstrap/
      common/
      modules/
        access-control/
        reference-data/
        policy-engine/
        party-identity/
        beneficiary-registry/
        historical-usage/
        entitlement-ledger/
        eligibility/
        reservation/
        manual-cases/
        ticketing/
        return-review/
        reconciliation/
        settlement/
        claim/
        payment-handoff/
        audit-reporting/
        integration-operations/
  worker/
    src/
      jobs/
      consumers/
packages/
  contracts/
    openapi/
    events/
    json-schema/
  domain/
  database/
    migrations/
    schema/
  reference-seeds/
  generated-client/
infra/
  docker/
  helm/
  terraform/
docs/
  adr/
  integration-guide/
  runbooks/
  traceability/
tests/
  contract/
  integration/
  e2e/
  load/
  security/
```

Mavjud npm ekotizimi sabab npm workspaces ishlatiladi.

Mavjud Vue frontend `apps/web`ga xavfsiz, alohida commitda ko‘chiriladi.

Ko‘chirishdan oldin va keyin `npm run typecheck` va `npm run build` bir xil natija berishi shart.

## 6. APIning umumiy qoidalari

### 6.1. Majburiy headerlar

Har bir write so‘rovi:

- `Authorization`;
- mTLS client certificate;
- `Idempotency-Key`;
- `X-Correlation-Id`;
- `X-Request-Timestamp`;
- kerak bo‘lsa `X-Payload-Signature`;
- `Content-Type: application/json`.

### 6.2. Identitet

`organization_id`, `carrier_id` va `source_system_id` server tomonidan token/certificate claimidan olinadi.

Bodyda berilgan qiymat claimga mos kelmasa `403 PRINCIPAL_ORGANIZATION_MISMATCH` qaytariladi.

### 6.3. Idempotency

Unique scope:

```text
client_id + endpoint_family + idempotency_key
```

Saqlanadi:

- request hash;
- first received time;
- response status;
- response body yoki operation reference;
- retention deadline.

Bir key va bir payload avvalgi natijani qaytaradi.

Bir key va boshqa payload `409 IDEMPOTENCY_PAYLOAD_MISMATCH` qaytaradi.

### 6.4. Xatolar

Standart body:

```json
{
  "error": {
    "code": "RESERVATION_EXPIRED",
    "message": "Rezervning amal muddati tugagan",
    "correlation_id": "01...",
    "retryable": false,
    "details": []
  }
}
```

Biznes natija `NOT_ELIGIBLE` bo‘lsa HTTP transport xatosi sifatida ko‘rsatilmaydi.

### 6.5. Sana va pul

- DB timestamp UTC;
- API ISO-8601 offset bilan;
- biznes kalendari `Asia/Tashkent`;
- pul integer minor unit yoki aniq decimal;
- floating-point ishlatilmaydi;
- currency va exponent reference-data orqali olinadi.

## 7. Kanonik API resource familylari

### 7.1. Manba idoralari

#### `POST /v1/beneficiary-events`

Barcha manba idoralar va barcha kontingent eventlari uchun yagona endpoint.

`event_type`:

- `RIGHT_GRANTED`;
- `RIGHT_CORRECTED`;
- `RIGHT_REVOKED`;
- `RIGHT_REINSTATED`.

Minimal request:

```json
{
  "event_id": "01J...",
  "schema_version": "1.0",
  "event_type": "RIGHT_GRANTED",
  "occurred_at": "2026-09-01T10:00:00+05:00",
  "source": {
    "record_id": "987654",
    "record_version": 4
  },
  "person": {
    "pinfl": "**************",
    "identity_document_ref": "doc-token"
  },
  "right": {
    "legal_basis_code": "PART_EQ_10",
    "disability_group_code": null,
    "effective_from": "2026-10-01",
    "effective_to": null,
    "basis_document_ref": "protected-ref"
  }
}
```

Response `202` yoki idempotent `200`:

- `operation_id`;
- `event_id`;
- `acceptance_status`;
- `duplicate`;
- `validation_issues[]`.

#### `POST /v1/beneficiary-snapshots/batches`

Boshlang‘ich va reconciliation snapshot chunklari uchun yagona endpoint.

Batchda:

- `snapshot_id`;
- `as_of`;
- `chunk_number`;
- `is_last_chunk`;
- `expected_total_count`;
- `expected_checksum`;
- `high_water_mark`;
- `records[]`.

Snapshotda yo‘q yozuv avtomatik revoke qilinmaydi.

Bunday xatti-harakat faqat tasdiqlangan source policy bilan yoqiladi.

#### Historical usage family

- `POST /v1/historical-usage-imports`;
- `POST /v1/historical-usage-imports/{import_id}/lines/batch`;
- `POST /v1/historical-usage-imports/{import_id}/finalize`.

Finalize expected count, checksum, conflict natijasi va ikki tomonlama sign-offni tekshiradi.

### 7.2. Eligibility va reservation

#### `POST /v1/eligibility/check`

Read-only eligibility.

Huquqni band qilmaydi va ticket issue uchun yakuniy authorization bo‘la olmaydi.

Response:

- `ELIGIBLE`;
- `NOT_ELIGIBLE`;
- `MANUAL_DOCUMENT_REQUIRED`;
- `offers[]`;
- `reason_codes[]`;
- `source_as_of`;
- `decision_expires_at`;
- `stale_data`.

#### `POST /v1/entitlements/check-and-reserve`

Real ticket issue oldidan ishlatiladigan atomar endpoint.

Minimal request tarkibi:

- request ID;
- benefitsiar identifikatori;
- applicant role;
- representative authorization reference, agar kerak bo‘lsa;
- companion/principal reference, agar kerak bo‘lsa;
- `offer_id`;
- transport mode;
- origin/destination node va country;
- departure/service;
- fare class;
- OUTBOUND yoki RETURN leg;
- manual token, agar manual case tasdiqlangan bo‘lsa.

Muvaffaqiyatli response:

- `reservation_id`;
- `status = HELD`;
- `expires_at`;
- server hisoblagan benefit;
- ruxsat etilgan fare classlar;
- policy version/hash;
- identity/source snapshot;
- entitlement bundle va leg reference;
- qolgan limit.

Backend bir transaction ichida:

1. idempotency yozuvini tekshiradi;
2. person/right/policy snapshotini oladi;
3. benefit account va legni lock qiladi;
4. conflictni tekshiradi;
5. ledger hold yozadi;
6. reservation yaratadi;
7. eligibility decision va audit yozadi;
8. outbox event yozadi;
9. commit qiladi.

#### Reservation query/release

- `GET /v1/reservations/{reservation_id}`;
- `POST /v1/reservations/{reservation_id}/release`.

GET faqat opaque ID bilan va tashkilot scope’ida ishlaydi.

### 7.3. Ticket family

#### `POST /v1/tickets/issue`

Faqat faol `HELD` reservationni commit qiladi.

Request:

- reservation ID;
- carrier ticket ID;
- PNR/order reference;
- ticket issue time;
- passengerlar;
- segment/couponlar;
- route/service;
- fare breakdown;
- evidence references;
- carrier entity version.

Policy, discount, authorization source va eligible amount bodydan ishonib olinmaydi.

Ular reservation snapshotidan olinadi.

Issue ACK yo‘qolsa ayni idempotency key ayni ticket va ledger natijasini qaytaradi.

Tugagan reservation yangi huquqni avtomatik sarflamaydi.

#### `POST /v1/tickets/{ticket_id}/events`

Event turlari:

- `TRAVELLED`;
- `RETURNED`;
- `CARRIER_CANCELLED`;
- `NO_SHOW`;
- `VOIDED`;
- `RESCHEDULED`.

Har eventda:

- global event ID;
- occurred time;
- entity version;
- sabab kodi;
- dalil reference;
- previous/new ticket reference, kerak bo‘lsa;
- nonuse/cancellation/return vaqtlar;
- server tekshiradigan reschedule authorization.

Return-before-issue event vaqtincha pending store’ga tushadi.

Konfiguratsiyalangan va 24 soatdan oshmaydigan muddatda issue kelmasa DLQ va case yaratiladi.

#### Bulk recovery

- `POST /v1/ticket-events/batches`;
- `POST /v1/travel-evidence`.

Bulk recovery real-time eventni takrorlasa biznes natija o‘zgarmaydi.

### 7.4. Manual verification

- `POST /v1/manual-verification-cases`;
- `POST /v1/manual-verification-cases/{case_id}/documents`;
- `GET /v1/manual-verification-cases/{case_id}`;
- `POST /v1/manual-verification-cases/{case_id}/decision`.

Ijobiy qaror opaque one-time token yaratadi.

Raw token log, audit yoki DBda saqlanmaydi.

DBda tokenning KMS/HMAC hashi saqlanadi.

Token quyidagilarga bog‘lanadi:

- case;
- person;
- policy/offer;
- carrier;
- transport va geography;
- journey/service/date;
- expiry;
- consumed status.

### 7.5. Reconciliation

- `POST /v1/reconciliation-cases/{case_id}/decision`;
- `GET /v1/audit-evidence/{decision_id}`.

Tashuvchi bodyda `APPROVED_EXCEPTION` yuborib mustaqil istisno yarata olmaydi.

### 7.6. Settlement va claim

- `POST /v1/settlements`;
- `POST /v1/settlements/{settlement_id}/lines/batch`;
- `POST /v1/settlements/{settlement_id}/attachments`;
- `POST /v1/settlements/{settlement_id}/submit`;
- `GET /v1/settlements/{settlement_id}`.

`settlement_id` carrier+davr bo‘yicha tekshiruv konteyneri.

Submit:

1. period cutoffni tekshiradi;
2. line’larni kanonik ticket registry bilan solishtiradi;
3. attachment hash va ERIni tekshiradi;
4. D-03 settlement-basis va formulani tekshiradi;
5. validation snapshotni muzlatadi;
6. immutable claim version yaratadi;
7. oldingi correction claimni `SUPERSEDED` qiladi;
8. rasmiy `submitted_at`ni yozadi.

Settlement IDning o‘zi payment handoff asosi bo‘la olmaydi.

### 7.7. Finance handoff

- `POST /v1/claims/{claim_id}/payment-submit`;

`payment-submit` faqat:

- `ACCEPTED`;
- yoki D-03 reglamenti ruxsat etsa `PARTIALLY_ACCEPTED`

claimga qo‘llanadi.

Requestda server claimdan oladi:

- immutable claim ID/version;
- payload hash;
- accepted amount;
- carrier/payee;
- bank account revision;
- budget source;
- signature reference.

Tashqi finance adapter idempotent delivery va retry yuritadi.

MVP moliya ATining faqat texnik ACK/NACK javobini saqlaydi va bank transfer bajarmaydi.

Quyidagi kanonik endpointlar spetsifikatsiyada saqlanadi, ammo ushbu “to‘lovgacha” MVP runtime’ida deploy qilinmaydi; ular keyingi post-payment monitoring bosqichi uchun contract stub hisoblanadi:

- `POST /v1/payment-status-events`;
- `GET /v1/payments/{payment_id}`.

### 7.8. Reference-data API

- `GET /v1/reference-data/catalogs`;
- `GET /v1/reference-data/{catalog_code}`;
- `POST /v1/reference-data/change-requests`;
- `POST /v1/reference-data/change-requests/{id}/approve`;
- `POST /v1/reference-data/change-requests/{id}/publish`.

GET filterlari:

- `as_of`;
- `changed_since`;
- `status`;
- `lang`;
- `include_relations`.

Har katalog uchun yangi table yoki endpoint yaratilmaydi.

## 8. Universal reference-data modeli

### 8.1. Jadvallar

#### `reference_catalog`

- `catalog_id uuid pk`;
- `code text unique`;
- `family_code`;
- `name_key`;
- `description_key`;
- `owner_organization_id`;
- `ownership_type`;
- `schema_json`;
- `is_external_master`;
- `read_policy_code`;
- `write_policy_code`;
- `created_at`.

#### `reference_entry`

- `entry_id uuid pk`;
- `catalog_id fk`;
- `code text`;
- `created_at`;
- unique `(catalog_id, code)`.

#### `reference_entry_revision`

- `revision_id uuid pk`;
- `entry_id fk`;
- `revision_no`;
- `status`;
- `valid_from`;
- `valid_to`;
- `system_from`;
- `system_to`;
- `attributes jsonb`;
- `legal_document_ref`;
- `source_record_ref`;
- `owner_organization_id`;
- `gate_code`;
- `approved_by`;
- `approved_at`;
- `signature_ref`;
- `payload_hash`;
- unique `(entry_id, revision_no)`.

#### Qo‘shimcha reference jadvallari

- `reference_relation`;
- `reference_translation`;
- `reference_change_request`;
- `reference_change_item`;
- `reference_approval`;
- `reference_import_job`;
- `reference_import_error`;
- `decision_gate`;
- `feature_gate_dependency`.

### 8.2. Reference governance

- stable code o‘zgartirilmaydi;
- mazmun revision orqali o‘zgaradi;
- published revision update qilinmaydi;
- yangi revision oldingi valid periodni yopadi;
- retroaktiv revision alohida approval talab qiladi;
- tashqi master katalog lokal steward tomonidan to‘g‘ridan-to‘g‘ri tahrirlanmaydi;
- policy transaction doim `revision_id`ni snapshot qiladi;
- UI label tarjimasi transaction logikasidan ajratiladi;
- OPEN_DECISION entry production policyga ulanmaydi;
- draft/demo carrier, route yoki country productionda selectable bo‘lmaydi.

### 8.3. MVP kataloglari

#### Normativ va toifa

- `legal_documents`;
- `legal_basis`;
- `disability_equivalence_bases`;
- `participant_equivalence_bases`;
- `benefit_profiles`;
- `disability_groups`;
- `basis_document_types`;
- `source_ownership_matrix`.

#### Policy

- `benefit_policy_parameters`;
- `benefit_policy_matrix`;
- `policy_priority`;
- `deduplication_rules`;
- `discount_types`;
- `benefit_cycles`;
- `limit_units`;
- `regulatory_deadlines`;
- `decision_gates`;
- `payment_channels`.

#### Transport

- `transport_modes`;
- `fare_classes`;
- `countries`;
- `agreement_country_versions`;
- `territory_scopes`;
- `transport_nodes`;
- `routes`;
- `service_types`;
- `manual_document_types`;
- `currencies`;
- `fare_component_types`;
- `tax_fee_types`;
- `rounding_rules`;
- `exchange_rate_sources`.

#### Tashkilot

- `source_organizations`;
- `carriers`;
- `authorized_branches`;
- `cash_desks`;
- `integration_clients`;
- `settlement_payees`;
- `bank_account_types`.

#### Identity va murojaatchi

- `applicant_roles`;
- `citizenship_statuses`;
- `residency_statuses`;
- `identity_document_types`;
- `representative_authority_types`.

#### Lifecycle va operatsiya

- `contingent_event_types`;
- `eligibility_results`;
- `eligibility_reason_codes`;
- `leg_types`;
- `entitlement_leg_states`;
- `reservation_states`;
- `authorization_sources`;
- `ticket_event_types`;
- `ticket_states`;
- `return_reasons`;
- `return_review_statuses`;
- `evidence_types`;
- `attachment_types`;
- `settlement_basis`;
- `settlement_stages`;
- `claim_statuses`;
- `payment_statuses`;
- `reconciliation_case_types`;
- `business_error_codes`;
- `retention_classes`;
- `audit_purpose_codes`.

### 8.4. C01–C11 qoidasi

C01–C11:

- rasmiy yopiq katalog deb ko‘rsatilmaydi;
- `OPEN_DECISION` bo‘lib qoladi;
- D-01 tasdiqlanmaguncha production policyga ulanmaydi;
- DIS_EQ_01…04 va PART_EQ_01…10 legal-basis kodlarini almashtirmaydi;
- C08 mustaqil kontingent emas;
- C07 `CHERNOBYL_DISABLED_RAIL` bilan avtomatik birlashtirilmaydi.

## 9. Typed ma’lumotlar modeli

### 9.1. Identity va person

#### `person`

- internal UUID primary key;
- display-safe person number;
- status;
- created/updated timestamps.

PINFL primary key bo‘lmaydi.

#### `person_identifier`

- person FK;
- identifier type;
- encrypted value;
- KMS/HMAC lookup hash;
- source;
- valid period;
- unique active `(identifier_type, lookup_hash)`.

#### `identity_document`

- person;
- document type revision;
- encrypted/tokenized number;
- issuer;
- valid from/to;
- digital document flag;
- protected reference.

#### `identity_verification`

- person;
- authoritative source;
- result;
- checked at;
- source as-of;
- expiry/freshness;
- request/response hash.

#### `legal_representative_link`

- beneficiary;
- representative;
- authority type;
- basis document reference;
- scope;
- valid from/to;
- verified source/time.

### 9.2. Kontingent

#### `source_event`

- source client;
- global event ID;
- source record ID/version;
- event type;
- occurred/received time;
- payload hash;
- processing status;
- unique `(source_client_id, event_id)`;
- unique source version policy.

#### `legal_entitlement`

- person;
- stable entitlement identity;
- legal basis revision;
- source owner;
- status;
- valid time;
- system time;
- basis document reference.

#### `entitlement_revision`

- immutable revision;
- previous revision;
- correction reason;
- received source event;
- effective period;
- decision hash.

#### `category_assignment`

- entitlement revision;
- technical profile, agar published mapping mavjud bo‘lsa;
- disability group;
- mapping policy version;
- status.

#### Data-quality

- `ingestion_operation`;
- `quarantine_item`;
- `data_quality_issue`;
- `source_snapshot`;
- `source_snapshot_chunk`.

### 9.3. Historical usage

- `historical_usage_import`;
- `historical_usage_line`;
- `historical_usage_conflict`;
- `historical_usage_signoff`.

Import `FINALIZED` bo‘lishi uchun count, checksum, conflict va sign-off shart.

D-05 yoki finalized import bo‘lmasa biennial conversion yoqilmaydi.

### 9.4. Policy

- `policy`;
- `policy_version`;
- `policy_legal_basis`;
- `policy_condition`;
- `policy_transport_rule`;
- `policy_geography_rule`;
- `policy_fare_rule`;
- `policy_limit_rule`;
- `policy_document_rule`;
- `policy_settlement_rule`;
- `policy_priority_rule`;
- `compiled_policy_snapshot`.

Published policy immutable.

Expressionlar tasdiqlangan safe DSLda saqlanadi.

Runtime `eval` yoki dynamic SQL yo‘q.

### 9.5. Ledger va reservation

#### `benefit_account`

- person;
- policy version;
- cycle start/end;
- account status;
- unique `(person_id, policy_version_id, cycle_start, cycle_end)`.

#### `entitlement_bundle`

- account;
- benefit year/yillari;
- selected transport mode, agar lock qilingan bo‘lsa;
- principal bundle, agar companion bo‘lsa;
- status.

#### `entitlement_leg`

- bundle;
- `OUTBOUND` yoki `RETURN`;
- current state;
- version;
- unique `(bundle_id, leg_type)`.

#### `ledger_entry`

- immutable entry ID;
- account/bundle/leg;
- debit/credit/action;
- reason code;
- before/after balance;
- source aggregate;
- actor;
- timestamp;
- previous entry hash;
- entry hash.

Update/delete DB privilege berilmaydi.

#### `reservation`

- reservation ID;
- leg;
- carrier;
- journey snapshot;
- offer/policy snapshot;
- identity/source snapshot;
- server-derived authorization source;
- status;
- expires/committed/released time;
- idempotency record;
- manual authorization, agar kerak bo‘lsa.

DB partial unique constraint bir leg uchun bir vaqtda bittadan ortiq faol hold/commitni bloklaydi.

Reservation expiration DB timega asoslanadi.

### 9.6. Eligibility

- `eligibility_request`;
- `eligibility_decision`;
- `eligibility_offer`;
- `eligibility_reason`;
- `decision_source_snapshot`.

Inputning raw PII nusxasi auditda saqlanmaydi.

Encrypted business record va pseudonymized audit alohida bo‘ladi.

### 9.7. Manual case

- `manual_verification_case`;
- `case_document`;
- `case_assignment`;
- `case_decision`;
- `manual_authorization`;
- `appeal_case`.

Positive decision va token yaratish bitta transactionda bajariladi.

Token consume va reservation yaratish ham bitta transactionda bajariladi.

### 9.8. Ticketing

- `ticket`;
- `ticket_passenger`;
- `ticket_segment`;
- `ticket_event`;
- `fare_breakdown`;
- `travel_evidence`;
- `return_review`;
- `reschedule_chain`;
- `companion_link`.

Unique constraintlar:

- `(carrier_id, carrier_ticket_id)`;
- `(carrier_id, source_event_id)`;
- bir reservationdan ruxsat etilgan miqdordan ortiq canonical issue yo‘q;
- reschedule chain ichida bitta active successor;
- bir segment va payment channel bo‘yicha bitta settlement allocation.

### 9.9. Settlement, claim va handoff

#### `settlement_period`

- carrier;
- year/month;
- cutoff;
- status;
- unique `(carrier_id, year, month)`.

#### `settlement`

- period;
- carrier;
- stage;
- submitted at;
- source payload hash;
- signature reference.

#### `settlement_line`

- ticket segment;
- reservation;
- authorization source;
- settlement-basis revision;
- actual fare;
- preferential fare;
- passenger paid;
- claimed compensation;
- calculated compensation;
- validation status;
- evidence completeness.

#### `line_validation_result`

- rule code/version;
- pass/fail/warning;
- reason;
- calculated values;
- timestamp.

#### `claim`

- claim ID;
- settlement ID;
- version;
- previous claim ID;
- immutable payload hash;
- requested/accepted/rejected/outstanding amount;
- submitted at;
- status;
- ERI signature;
- unique `(settlement_id, version)`.

Accepted claim update qilinmaydi.

Correction yangi claim yaratadi.

#### `payment_handoff`

- payment/handoff ID;
- exact claim ID/version;
- claim payload hash;
- accepted amount;
- channel;
- external system;
- external request/order reference;
- delivery status;
- accepted claim amount;
- technical ACK/NACK code va payload hash;
- timestamps.

#### `payment_status_event` · keyingi bosqich

Bu schema kanonik spetsifikatsiyadagi kelajak kontrakti sifatida hujjatlashtiriladi, ammo MVP migration/runtime/API/UIga kiritilmaydi:

- external event ID;
- payment handoff;
- canonical payment status;
- external status;
- amount;
- occurred/received time;
- payload hash/signature;
- unique `(external_system_id, external_event_id)`.

### 9.10. Integration va audit

- `idempotency_record`;
- `inbox_message`;
- `outbox_message`;
- `operation`;
- `webhook_delivery`;
- `integration_client`;
- `certificate_version`;
- `audit_log`;
- `audit_archive_batch`;
- `attachment`;
- `business_calendar`.

Outbox biznes transaction bilan bir transactionda yoziladi.

Consumer at-least-once ishlaydi, biznes natija idempotency bilan effectively-once bo‘ladi.

## 10. State-machine’lar

### 10.1. Huquq

```text
PENDING_VERIFICATION -> ACTIVE -> REVOKED
                              -> EXPIRED
```

`SUSPENDED` faqat vakolat, sabab va ticketga ta’sir tasdiqlansa qo‘shiladi.

### 10.2. Entitlement leg

```text
AVAILABLE -> HELD -> CONSUMED
HELD -> RELEASED -> AVAILABLE
CONSUMED -> RESTORE_REVIEW -> RESTORED -> AVAILABLE
HELD/CONSUMED -> REVIEW_REQUIRED
```

`CONSUMED(reason=DEEMED_PROVIDED)` safar bo‘lganini anglatmaydi.

### 10.3. Reservation

```text
HELD -> COMMITTED
HELD -> RELEASED
HELD -> EXPIRED
HELD/COMMITTED -> REVIEW_REQUIRED
```

### 10.4. Manual case va token

```text
OPEN -> UNDER_REVIEW -> APPROVED
                     -> REJECTED
                     -> EXPIRED

UNUSED_TOKEN -> CONSUMED_TOKEN
             -> EXPIRED_TOKEN
```

### 10.5. Ticket

```text
ISSUED -> TRAVELLED
       -> CARRIER_CANCELLED
       -> RETURN_PENDING -> RETURNED
                         -> RETURN_DEADLINE_EXPIRED
       -> NO_SHOW
       -> EXCHANGED
       -> VOID
       -> ERROR/RECONCILIATION
```

### 10.6. Claim

```text
DRAFT -> VALIDATING -> READY_TO_SUBMIT -> SUBMITTED -> ACCEPTED -> CLOSED
                  \-> NEEDS_CORRECTION -> SUPERSEDED
SUBMITTED -> PARTIALLY_ACCEPTED
SUBMITTED -> REJECTED
ACCEPTED/PARTIALLY_ACCEPTED -> ADJUSTMENT_REQUIRED
```

`CLOSED` faqat tasdiqlangan moliyaviy reglamentdagi reconciliation sharti bajarilganda.

### 10.7. Finance handoff va tashqi status

```text
NOT_READY -> CREATED -> QUEUED -> SUBMITTED -> ACKNOWLEDGED
                                \-> RETRYING
                                \-> REJECTED
```

Tashqi payment canonical statuslari keyingi post-payment monitoring bosqichida alohida state-machine bo‘ladi:

```text
CREATED
SUBMITTED
ACCEPTED
REJECTED
PAYMENT_ORDER_CREATED
PROCESSING
PARTIALLY_PAID
PAID
FAILED
RETRYING
REVERSED
RECONCILED
```

Claim va payment bitta state-machine emas. Yuqoridagi payment statuslari MVP runtime’ida qabul qilinmaydi.

## 11. Majburiy biznes invariantlari

1. `legal_basis_code` C01–C11 bilan almashtirilmaydi.
2. Bir shaxs bir necha source’dan kelsa yangi person dublikati yaratilmaydi.
3. Source faqat ownership matrix ruxsat bergan legal-basisni yuboradi.
4. Huquqning `ACTIVE`ligi limit qolganini anglatmaydi.
5. Real issue faqat atomar reservation orqali bo‘ladi.
6. Oddiy eligibility check huquqni band qilmaydi.
7. Barcha carrierlar bitta global ledgerdan foydalanadi.
8. OUTBOUND va RETURN alohida leg, bitta bundle ichida.
9. Mixed-mode D-02siz productionda ishlamaydi.
10. C11 faqat UZ domestic RAIL/AIR; “ikki marta” birligi D-02siz yoqilmaydi.
11. Biennial conversion D-02 va D-05siz yoqilmaydi.
12. C08 mustaqil kontingent/account emas.
13. Companion principalning tasdiqlangan journey/service/date’iga bog‘lanadi.
14. Principal invalid bo‘lsa companion ticket settlementga to‘g‘ridan-to‘g‘ri o‘tmaydi.
15. Identity document ticket issue va travel sanasida amal qiladi.
16. `RIGHT_NOT_FOUND_IN_YAMIH` yakuniy avtomatik rad emas; manual fallback taklif qiladi.
17. Manual token tashuvchi tomonidan yaratilmaydi.
18. `LEGACY_MIGRATION` yangi issue authorization emas.
19. Return limitni bevosita tiklamaydi; avval review va dalil.
20. `PASSENGER_REQUEST` avtomatik restore emas.
21. Texnik/tabiiy/boshqa nonuse dalil va tasdiqlangan deadline talab qiladi.
22. “Bir hafta”ning aniq talqini D-03 reference parametridan olinadi.
23. `RETURN_DEADLINE_EXPIRED` `TRAVELLED` emas.
24. Reschedule eski va yangi ticketni chain bilan bog‘laydi.
25. Reschedule ikki marta claim qilinmaydi.
26. Expired reservation bilan kech issue yangi entitlementni avtomatik sarflamaydi.
27. Ticket issue commitdan keyin carrier muvaffaqiyatsiz bo‘lsa VOID/restore yoki case orqali bitta kanonik natija qoladi.
28. Eligibility so‘rovlari soni settlement asosi emas.
29. Claim line ticket segment, committed reservation va evidencega bog‘lanadi.
30. Settlement-basis D-03siz production `CLAIMABLE` bermaydi.
31. Pul hisoblari floating-point emas.
32. Claim immutable; correction yangi version.
33. Payment handoff aynan accepted claim versionga bog‘lanadi.
34. Bir segment bir payment channelda bir martadan ortiq qoplanmaydi.
35. Social Card realtime channel MVPda o‘chiq.

## 12. Rollar va permission modeli

### 12.1. Runtime rollar

| Rol | Permissionlar | Cheklov |
|---|---|---|
| `SOURCE_PUBLISHER` | O‘z source event/snapshotini yuborish, operation natijasini ko‘rish | Boshqa source va toifaga yozolmaydi |
| `REFERENCE_DATA_STEWARD` | Reference/policy draft va import | Publish qila olmaydi |
| `REFERENCE_DATA_APPROVER` | Maker-checker approval va ERI publish | O‘z draftini yakka tasdiqlay olmaydi |
| `AGENCY_REGISTRY_OPERATOR` | Kontingent, conflict, quarantine va data-quality case | Ledger va policy publishni o‘zgartira olmaydi |
| `CARRIER_ELIGIBILITY` | Individual eligibility/check-and-reserve | Bulk person enumeration yo‘q |
| `CARRIER_ISSUER` | O‘z carrieri reservation/ticket eventlari | Boshqa carrier ticketini ko‘rmaydi |
| `CARRIER_SUPERVISOR` | Lost-ACK, orphan va reconciliation case | Ledgerni bevosita tahrirlamaydi |
| `CASE_REVIEWER` | Manual, return va ruxsat etilgan reconciliation qarori | Permission+organization+ERI talab qilinadi |
| `CARRIER_FINANCE` | O‘z settlementi, attachment, ERI submit | Boshqa carrier claimini ko‘rmaydi |
| `AGENCY_FINANCE_CHECKER` | Line validation, exception, correction request | Payment handoffni approve qilmaydi |
| `AGENCY_FINANCE_APPROVER` | Claim accept/partial/reject va finance handoff | Maker-checker talab qilinadi |
| `SOCIAL_INSPECTOR` | Normativ ijro bo‘yicha read-only | PII minimal ko‘rinadi |
| `FINANCIAL_INSPECTOR` | Moliyaviy audit read-only | Operatsion mutation yo‘q |
| `AUDITOR` | WORM audit va evidence export | Biznes mutation yo‘q |
| `INTEGRATION_OPERATOR` | Client/certificate/queue/webhook monitoring | Biznes qaror yo‘q |
| `SYSTEM_ADMIN` | Infra konfiguratsiya | Policy, huquq, ledger, claim va auditni o‘zgartirmaydi |

### 12.2. Ekranlar

| Ekran | Asosiy foydalanuvchi |
|---|---|
| Transport benefits dashboard | Agentlik operatorlari va rahbariyat |
| Kontingent inbox va source freshness | Source publisher, registry operator |
| Kontingent registry/detail/history | Registry operator, auditor |
| Quarantine va data-quality | Registry operator, source publisher |
| Eligibility/check-and-reserve | Carrier eligibility |
| Reservation/lost-ACK lookup | Carrier issuer/supervisor |
| Manual cases | Case reviewer, carrier read-only |
| Ticket issue va lifecycle | Carrier issuer |
| Return review | Case reviewer |
| Operational reconciliation | Carrier supervisor, agency operator |
| Settlement period/batch | Carrier finance |
| Settlement validation | Agency finance checker |
| Claim approval/handoff | Agency finance approver |
| Payment/handoff status | Carrier finance, agency finance |
| Ma’lumotnomalar | Steward, approver, barcha rollar read-only scope’da |
| Policy/gate registry | Steward, approver, auditor |
| Integration clients/certificates | Integration operator |
| Audit/evidence | Auditor va vakolatli inspector |
| Reports | Role/organization scope bo‘yicha |

UI elementni yashirishning o‘zi xavfsizlik emas.

Har permission backendda tekshiriladi.

### 12.3. Biznes RACI

| Workstream | Accountable | Responsible | Consulted | Informed |
|---|---|---|---|---|
| Legal-basis va D-01 | Agentlik | Agentlik + 6 manba idora | Yuridik ekspert | Tashuvchilar |
| Safar/limit va D-02 | Agentlik | Product/policy jamoa | Transport vazirligi, yuridik ekspert | Tashuvchilar |
| Settlement va D-03 | Agentlik | Finance product owner | Transport va Iqtisodiyot-moliya vakillari | Carrier finance |
| Manual fallback va D-04 | Agentlik | Case-management owner | Tashuvchilar, Transport vazirligi | Source idoralar |
| Historical usage va D-05 | Agentlik | Data migration lead | Legacy registry owners | Auditor |
| Rail qo‘shimcha scope va D-06 | Agentlik | Rail integration owner | Transport vazirligi, temir yo‘l | Product team |
| Social Card D-07 | Agentlik | 2027 program owner | Transport va Iqtisodiyot-moliya | MVP team |
| Security | CISO/Agentlik | Security lead | Platform/DevOps | Barcha ishtirokchilar |
| Production release | Agentlik product owner | Release manager | Security, legal, operations | Barcha ishtirokchilar |

## 13. Xavfsizlik va privacy

### 13.1. Authentication va authorization

- gatewayda mTLS;
- service client uchun OAuth2 client credentials;
- foydalanuvchi uchun OIDC;
- privilegiyali foydalanuvchi uchun MFA;
- tashkilot, rol, hudud va purpose bo‘yicha RBAC+ABAC;
- har requestda principal va organization context;
- finance/manual approvalda maker-checker;
- ERI signature verification;
- service account va certificate rotatsiyasi.

### 13.2. PII

- PINFL, hujjat, bank va sog‘liq/nogironlik ma’lumoti at-rest encryption;
- qidiruv uchun KMS/HMAC lookup hash;
- PINFL URL, log, trace, metric label yoki exception textda yo‘q;
- carrierga minimal benefit response;
- auditda pseudonymized person ID;
- support ekranida default masking;
- export faqat purpose va permission bilan;
- retention/destruction yuridik tasdiqlangan katalogdan olinadi.

### 13.3. Replay va enumeration

- request timestamp va nonce;
- signature validation;
- nonce replay store;
- per-client, per-purpose va per-person rate-limit;
- sequential enumeration detection;
- bulk eligibility endpoint yo‘q;
- suspicious activity alert.

### 13.4. Fayllar

- pre-signed upload;
- MIME va size allowlist;
- antivirus/DLP;
- SHA-256;
- ERI/signature verification;
- object key random;
- public URL yo‘q;
- retention class;
- WORM, kerakli dalillar uchun.

### 13.5. Audit minimumi

Har muhim operation:

- trusted timestamp;
- actor/service client;
- organization;
- purpose;
- request/correlation/idempotency ID;
- pseudonymous person ID;
- object type/ID;
- before/after hash;
- policy/reference revision;
- eligibility reason;
- ticket/claim/payment/reconciliation IDs;
- manual decision va approver;
- ERI reference.

Audit update/delete qilinmaydi.

## 14. D-01…D-07 production gate enforcement

### D-01

Qaror:

- profil/subtoifa katalogi;
- category × source ownership;
- priority/deduplication.

Ochiq bo‘lsa:

- C01–C11 faqat draft/sandbox;
- production policy publish bloklanadi;
- source ownershipdan tashqari event quarantine qilinadi.

### D-02

Qaror:

- mixed-mode;
- benefit yili va cross-year;
- C11 “ikki marta”;
- companion/biennial.

Ochiq bo‘lsa tegishli offer productionda chiqarilmaydi.

### D-03

Qaror:

- settlement-basis;
- return/no-show/deemed-provided;
- tarif komponentlari va rounding;
- ERI submission momenti;
- 10 ish kuni;
- partial approval/correction.

Ochiq bo‘lsa:

- line `CLAIMABLE` bo‘lmaydi;
- compensation faqat sandbox preview;
- qualifying return avtomatik restore qilinmaydi.

### D-04

Qaror:

- manual hujjatlar;
- reviewer vakolati;
- SLA;
- transport scope.

Ochiq bo‘lsa manual case qabul qilinishi mumkin, lekin production issue authorization berilmaydi.

### D-05

Qaror:

- historical source/import sign-off;
- yoki formal transition.

Ochiq bo‘lsa biennial conversion bloklanadi.

### D-06

Qaror:

- 4-ilova 152-band qo‘shimcha rail toifalari;
- owner/API/fallback.

Ochiq bo‘lsa `CHERNOBYL_DISABLED_RAIL` va boshqa qo‘shimcha scope aktiv emas.

### D-07

Qaror:

- monthly va Social Card real-time channel chegarasi.

Social Card MVPdan tashqari va feature doim o‘chiq.

### Gate texnik modeli

`decision_gate`da:

- code;
- status;
- ownerlar;
- approved document reference;
- signature;
- approved at;
- effective from;
- version.

`feature_gate_dependency`da:

- feature code;
- gate code;
- required gate status;
- activation policy.

System admin signed gate’ni bypass qila olmaydi.

## 15. Work package’lar

### WP-00 — Baseline va governance

Dependency: yo‘q.

Ishlar:

- kanonik hashni tekshirish;
- requirement traceability baseline;
- scope/non-goalni freeze qilish;
- D-gate owner va artefakt formatini belgilash;
- architecture ADR;
- threat model;
- data classification;
- platform standardini tasdiqlash.

Output:

- `docs/adr`;
- traceability matrix;
- gate register;
- approved system context;
- risk register.

Acceptance:

- kanonik fayl o‘zgarmagan;
- har ochiq normativ masala D-IDga ega;
- hech bir draft production fact deb belgilanmagan.

### WP-01 — Monorepo va platform foundation

Dependency: WP-00.

Ishlar:

- npm workspaces;
- `apps/web`, `apps/api`, `apps/worker`;
- Docker Compose;
- config validation;
- health/readiness;
- IAM integration;
- PostgreSQL migrations;
- Redis/Rabbit/MinIO adapters;
- OpenTelemetry;
- CI skeleton.

Output:

- local one-command environment;
- authenticated empty API;
- DB migration pipeline;
- metrics/log/trace baseline.

Acceptance:

- fresh clone localda ko‘tariladi;
- unauthenticated access rad qilinadi;
- build/typecheck/test o‘tadi;
- secrets repositoryga yozilmagan.

### WP-02 — Reference-data va gate engine

Dependency: WP-01.

Ishlar:

- universal reference schema;
- current `reference-data.ts`ni bootstrap seedga aylantirish;
- draft/open statuslarni saqlash;
- list/as-of/changed-since API;
- change request;
- maker-checker approval;
- publish;
- gate dependency enforcement;
- frontend reference pagesni APIga ulash.

Output:

- versioned reference registry;
- seed migration;
- steward/approver UI;
- audit.

Acceptance:

- published revision edit qilinmaydi;
- historical as-of qaytadi;
- C01–C11 OPEN_DECISION;
- demo carrier/route productionda aktiv emas;
- form selectlari API katalogidan keladi.

### WP-03 — Identity va access isolation

Dependency: WP-01, WP-02.

Ishlar:

- person/identifier/document;
- encryption/HMAC lookup;
- identity/residency adapter interface;
- representative link;
- RBAC+ABAC;
- tenant scope;
- PII masking.

Output:

- identity domain;
- mock/sandbox authoritative adapter;
- production adapter contract;
- access tests.

Acceptance:

- PINFL URL/logda yo‘q;
- duplicate PINFL person yaratmaydi;
- carrier cross-tenant data ko‘rmaydi;
- expired document aniqlanadi.

### WP-04 — Beneficiary registry

Dependency: WP-02, WP-03.

Ishlar:

- beneficiary-events;
- snapshots/batches;
- inbox/idempotency;
- out-of-order handling;
- legal entitlement bitemporal history;
- ownership enforcement;
- quarantine;
- data-quality dashboard.

Output:

- oltita source uchun universal contract;
- registry UI;
- source monitoring.

Acceptance:

- bir event 10 marta bitta natija;
- grant/correct/revoke/reinstate history saqlanadi;
- unauthorized basis quarantine/NACK;
- source freshness ko‘rinadi.

### WP-05 — Historical usage import

Dependency: WP-02, WP-03, WP-04.

Ishlar:

- import/header/chunk/finalize;
- count/checksum;
- duplicate/conflict;
- evidence/signature;
- source+Agency sign-off;
- transition gate.

Output:

- import API va UI;
- reconciliation report;
- finalized usage projection.

Acceptance:

- checksum xato bo‘lsa finalize yo‘q;
- unresolved conflict bo‘lsa finalize yo‘q;
- D-05siz biennial yo‘q.

### WP-06 — Policy engine

Dependency: WP-02, WP-04, WP-05.

Ishlar:

- safe DSL/schema;
- policy compiler;
- legal basis mapping;
- priority/dedup;
- mode/geography/class;
- annual/biennial;
- C11;
- companion rules;
- as-of replay.

Output:

- deterministic evaluator;
- decision explanation;
- table-driven tests.

Acceptance:

- ayni snapshot ayni natija;
- published revision replay qilinadi;
- open gate offer chiqarmaydi;
- tashuvchi benefit foizini belgilamaydi.

### WP-07 — Entitlement-ledger va reservation

Dependency: WP-03, WP-06.

Ishlar:

- account/bundle/leg;
- immutable ledger;
- check-and-reserve transaction;
- TTL/release;
- lost ACK;
- conflict;
- principal/companion slots;
- audit/outbox.

Output:

- global ledger;
- reservation API;
- reservation lookup UI.

Acceptance:

- 100 parallel reserve’da faqat biri g‘olib;
- TTLdan keyin leg ochiladi;
- duplicate retry yangi debit yaratmaydi;
- Redis yo‘qolsa ledger yo‘qolmaydi.

### WP-08 — Eligibility

Dependency: WP-03, WP-06, WP-07.

Ishlar:

- eligibility/check;
- check-and-reserve orchestration;
- identity/document/residency;
- reason catalog;
- source freshness;
- representative;
- manual-required result;
- frontend form/result.

Output:

- carrier eligibility API/UI;
- explainable decision;
- privacy-safe logs.

Acceptance:

- check hold yaratmaydi;
- reserve hold yaratadi;
- not-found manual-required qaytaradi;
- policy/source snapshot auditda replay bo‘ladi.

### WP-09 — Manual verification

Dependency: WP-02, WP-03, WP-07, WP-08.

Ishlar:

- case/documents;
- protected file upload;
- reviewer queue;
- permission+organization+ERI;
- one-time authorization;
- token consume;
- source reconciliation.

Output:

- case UI;
- authorization flow;
- full audit.

Acceptance:

- operator to‘g‘ridan-to‘g‘ri right yaratmaydi;
- token raw DB/logda yo‘q;
- token ikkinchi marta ishlamaydi;
- D-04 ochiq bo‘lsa production issue bloklangan.

### WP-10 — Ticket lifecycle

Dependency: WP-07, WP-08, WP-09.

Ishlar:

- tickets/issue;
- ticket event state-machine;
- segment/passenger/fare;
- evidence;
- return;
- no-show/cancel;
- reschedule chain;
- companion invalidation;
- return-before-issue handling.

Output:

- ticket API/UI;
- canonical registry;
- lifecycle audit.

Acceptance:

- issue reservationni atomar commit qiladi;
- expired reservation issue qilmaydi;
- return passenger-request auto restore qilmaydi;
- reschedule double claim bermaydi;
- out-of-order event case/DLQga tushadi.

### WP-11 — Return review va operational reconciliation

Dependency: WP-10.

Ishlar:

- return reason/evidence;
- server deadline;
- reviewer decision;
- restore transaction;
- orphan/lost event;
- daily comparisons;
- reconciliation case.

Output:

- return review UI;
- exception dashboard;
- reconciliation reports.

Acceptance:

- faqat permission+org+ERI reviewer qaror qiladi;
- approved review bitta restore yaratadi;
- late return deemed-providedni travelled qilmaydi;
- D-03siz auto restore yo‘q.

### WP-12 — Settlement va immutable claim

Dependency: WP-02, WP-10, WP-11.

Ishlar:

- period/batch/line;
- attachments;
- ticket-ledger reconciliation;
- settlement-basis;
- fare formula;
- line validation;
- partial/correction;
- ERI submit;
- immutable claim;
- business calendar.

Output:

- carrier finance UI;
- checker/approver UI;
- signed claim artefact;
- deadline dashboard.

Acceptance:

- eligibility count claim asosi emas;
- missing evidence line claimable emas;
- correction yangi claim ID/version;
- accepted claim update qilinmaydi;
- cutoff va 10 ish kuni to‘g‘ri.

### WP-13 — Finance handoff

Dependency: WP-12 va tasdiqlangan finance contract.

Ishlar:

- finance adapter;
- payment-submit;
- transactional outbox;
- retry/backoff;
- external ACK/rad;
- signature/idempotency;
- monitoring.

Output:

- finance handoff API;
- adapter contract test;
- handoff ACK/NACK operatsion UI;
- runbook.

Acceptance:

- settlement ID handoff bo‘la olmaydi;
- exact accepted claim version yuboriladi;
- duplicate submit ikkinchi instruction yaratmaydi;
- external invalid signature rad qilinadi;
- bank transfer kodi mavjud emas.

### WP-14 — Reporting, audit va evidence

Dependency: WP-04, WP-07, WP-10, WP-12, WP-13.

Ishlar:

- operational projections;
- normative reports;
- audit chain;
- WORM export;
- appeal/evidence package;
- inspector views.

Output:

- reports;
- evidence export;
- audit verification job.

Acceptance:

- decision snapshot qayta tiklanadi;
- admin auditni o‘zgartirmaydi;
- export purpose/permission bilan;
- report totals transaction source bilan reconcile.

### WP-15 — Integration sandbox va migration

Dependency: WP-04, WP-08, WP-10, WP-12.

Ishlar:

- source/carrier sandbox;
- test certificate;
- sample payload;
- negative scenarios;
- legacy history dry-run;
- carrier ticket reconciliation;
- certification checklist.

Output:

- integration guide;
- sandbox portal;
- certification report;
- migration sign-off.

Acceptance:

- har source/carrier contract testdan o‘tadi;
- checksum/reconciliation imzolangan;
- go-live clientlar allowlistda.

### WP-16 — Hardening va production readiness

Dependency: barcha MVP WPlar.

Ishlar:

- load/security/chaos;
- backup/restore;
- DR;
- alert/runbook;
- SLO;
- penetration remediation;
- cutover rehearsal;
- rollback.

Output:

- production readiness review;
- signed go-live checklist;
- operations handover.

Acceptance:

- p95/p99 target;
- RPO/RTO exercise;
- critical security finding yo‘q;
- ochiq gatega bog‘liq feature o‘chiq;
- support/on-call tayyor.

## 16. Fazalar va dependency ketma-ketligi

### Phase 0 — Qaror va foundation

Parallel:

- WP-00;
- platform tayyorgarligi;
- D-01…D-06 qaror jarayoni.

Exit:

- contract baseline;
- threat model;
- gate register;
- stack tasdiqlangan.

### Phase 1 — Master-data va kontingent

Ketma-ket:

- WP-01;
- WP-02;
- WP-03;
- WP-04;
- WP-05.

Exit:

- sources snapshot/delta yubora oladi;
- huquq tarixi va data-quality mavjud;
- policy uchun zarur reference foundation tayyor.

### Phase 2 — Real-time yadro

Ketma-ket:

- WP-06;
- WP-07;
- WP-08;
- WP-09.

Exit:

- carrier real-time eligibility/reserve qiladi;
- manual case gate bilan mavjud;
- double-spend bloklangan.

### Phase 3 — Ticket va foydalanish

- WP-10;
- WP-11;
- WP-15ning ticket certification qismi.

Exit:

- issue/return/travelled/reconciliation ishlaydi;
- 2026-10-01 dan settlement uchun barcha dalil yig‘iladi.

### Phase 4 — Oylik settlement va finance handoff

- WP-12;
- WP-13;
- WP-14;
- WP-15ning finance certification qismi.

Exit:

- oktabr batchi 2026-11-10 gacha qabul qilinadi;
- accepted claim exact version bilan finance ATiga yuboriladi.

### Phase 5 — Hardening va go-live

- WP-16;
- cutover;
- hypercare.

## 17. Test strategiyasi

### 17.1. Unit va table-driven

- approved profile/legal basis × transport × discount × geography × limit;
- DIS_EQ_01…04;
- PART_EQ_01…10;
- priority/no-double-benefit;
- annual/biennial;
- fare/class/top-up;
- settlement formula;
- business calendar.

OPEN_DECISION qiymatlar production expectation sifatida test qilinmaydi.

Ular gate blocked sifatida test qilinadi.

### 17.2. Property/concurrency

- ledger balance manfiy bo‘lmaydi;
- bitta legda bittadan ortiq active hold yo‘q;
- 100–1000 parallel reserve;
- duplicate key bir natija;
- crash/rollbackda half-commit yo‘q;
- token bir marta sarflanadi;
- claim sum line sumga teng.

### 17.3. Integration

- PostgreSQL transaction isolation;
- outbox/inbox;
- Rabbit retry/DLQ;
- Redis loss;
- object upload/scan;
- Keycloak role/tenant;
- finance adapter;
- identity adapter.

### 17.4. Contract

- OpenAPI request/response;
- JSON Schema event versions;
- backward compatibility;
- consumer-driven carrier/source contracts;
- webhook signature;
- canonical error catalog.

### 17.5. End-to-end

1. source grant → eligibility → reserve → issue → travelled → settlement → claim → handoff;
2. duplicate source event;
3. revoke correction;
4. two carriers parallel;
5. manual case → token → issue;
6. companion principal link;
7. qualifying return → review → restore;
8. passenger-request → consumed remains;
9. expired reservation → orphan case;
10. reschedule chain;
11. partial settlement acceptance;
12. claim correction;
13. finance ACK lost/retry;
14. invalid finance ACK/NACK signature.

### 17.6. Security

- IDOR/cross-carrier;
- privilege escalation;
- bulk enumeration;
- replay;
- invalid mTLS/JWT;
- PII log scan;
- SQL/JSON injection;
- malicious file;
- ERI tampering;
- audit mutation;
- secret scan.

### 17.7. Performance va resilience

Boshlang‘ich target:

- check-and-reserve p95 ≤ 2 s;
- p99 ≤ 4 s;
- API availability ≥ 99.9%;
- ticket ACK p95 ≤ 2 s;
- normal event processing lag ≤ 30 s;
- ledger RPO target 0;
- core RTO target ≤ 60 minut.

Sinovlar:

- peak carrier load;
- source snapshot load;
- month-end batch;
- DB failover;
- Rabbit/Redis outage;
- finance timeout;
- worker restart;
- restore rehearsal.

## 18. Observability

### 18.1. Metrics

- request count/latency/error per endpoint/client;
- eligibility result/reason;
- reservation conflict/expiry;
- ledger transaction failure;
- source freshness;
- snapshot count/checksum;
- quarantine/NACK;
- ticket event lag;
- orphan/out-of-order;
- return deadline;
- settlement validation failures;
- late settlement;
- claim amount/status;
- finance handoff retry/delay;
- DLQ depth;
- outbox backlog;
- certificate expiry;
- audit archive health.

Metric labelda PINFL, ticket ID yoki boshqa yuqori-cardinality PII bo‘lmaydi.

### 18.2. Alertlar

- critical API SLO breach;
- source freshness breach;
- ledger error;
- outbox/DLQ growth;
- object scan failure;
- ERI verification failure spike;
- reyestr deadline;
- handoff SLA;
- certificate expiry;
- backup failure;
- WORM archive failure.

### 18.3. Trace va log

- correlation ID barcha service/queue hopda;
- structured JSON log;
- PII redaction middleware;
- domain event name;
- safe aggregate reference;
- retry count;
- policy version;
- no raw payload for sensitive endpoints.

## 19. DevOps va release

### 19.1. Muhitlar

- local;
- development;
- integration sandbox;
- test;
- staging;
- production.

Sandbox synthetic PII ishlatadi.

Production dump non-productionga ko‘chirilmaydi.

### 19.2. CI pipeline

1. formatting/lint;
2. TypeScript typecheck;
3. unit tests;
4. DB migration test;
5. OpenAPI/schema validation;
6. contract compatibility;
7. integration tests;
8. frontend build;
9. SAST/dependency/secret scan;
10. SBOM;
11. container scan;
12. signed image;
13. staging deploy;
14. smoke/e2e;
15. manual production approval.

### 19.3. Migration qoidalari

- forward-only versioned migration;
- expand/migrate/contract;
- destructive migration alohida approval;
- zero-downtime index creation;
- migration checksum;
- rollback/runbook;
- ledger/audit tablega destructive change yo‘q.

### 19.4. Release flaglar

Feature flags texnik rollout uchun.

Normativ D-gate feature flag bilan almashtirilmaydi.

Production activation uchun ikkalasi ham kerak:

- signed gate status;
- technical release flag.

## 20. Mavjud frontendni productionga ko‘chirish

1. `TransportBenefitsPage.vue` rol va domenga ajratiladi.
2. Local mutable demo massivlar store/API queryga almashtiriladi.
3. `reference-data.ts` runtime source emas, seed artefaktga aylanadi.
4. Demo PINFLlar production bundle’dan chiqariladi.
5. Demo fare va settlement summalari production calculationda ishlatilmaydi.
6. Form selectlari reference-data APIga ulanadi.
7. OpenAPI’dan TypeScript client generatsiya qilinadi.
8. Server permission frontend permissionning source of truth’i bo‘ladi.
9. UI har qarorda policy/source snapshot va reason ko‘rsatadi.
10. OPEN gate UI’da aniq ko‘rinadi va action disabled bo‘ladi.
11. Mock mode faqat local/sandboxda explicit env flag bilan ishlaydi.
12. Production build mock fallbackga yashirin o‘tmaydi.

## 21. Migratsiya va cutover

### 21.1. Master-data

- current catalogs export;
- owner/status tekshiruvi;
- draft/open/active mapping;
- duplicate code detection;
- seed migration;
- steward sign-off.

### 21.2. Historical usage

- authoritative source inventory;
- field mapping;
- sample dry-run;
- count/checksum;
- duplicate/conflict;
- reconciliation;
- source+Agency ERI sign-off;
- finalize;
- biennial activation.

### 21.3. Source cutover

- initial snapshot;
- high-water mark;
- delta dual-run;
- count comparison;
- freeze window;
- switch;
- post-cutover reconciliation.

### 21.4. Carrier cutover

- sandbox certification;
- certificate/client provisioning;
- route/class mapping;
- pilot issue/return;
- lost-ACK drill;
- daily reconciliation;
- production allowlist.

### 21.5. Rollback

Rollback ledger/ticket historyni o‘chirmaydi.

Yangi issue vaqtincha bloklanishi mumkin.

In-flight eventlar inbox/outbox orqali qayta ishlanadi.

Manual offline issue faqat tasdiqlangan reglament bo‘lsa mumkin.

## 22. Requirement traceability

| REQ | Modul/API | Asosiy jadval | Test dalili |
|---|---|---|---|
| REQ-001 | Beneficiary registry | source_event, legal_entitlement | snapshot+delta reconciliation |
| REQ-002 | Entitlement-ledger | benefit_account, entitlement_leg, ledger_entry | annual/biennial balance tests |
| REQ-003 | Eligibility | eligibility_decision | policy matrix va SLA |
| REQ-004 | Reservation | reservation, ledger_entry | concurrent reservation |
| REQ-005 | Ticket issue | ticket, ticket_event | issue idempotency/lost ACK |
| REQ-006 | Ticket return | ticket_event, return_review | reason/deadline/restore |
| REQ-007 | Manual case | manual_verification_case, manual_authorization | document→decision→reserve→issue |
| REQ-008 | Ticket registry | ticket, ticket_segment, fare_breakdown | mandatory field validation |
| REQ-009 | Settlement | settlement_period, claim | cutoff va ERI |
| REQ-010 | Finance SLA | business_calendar, payment_handoff | 10 workday calculation/status |
| REQ-011 | Reporting | reporting projections, audit | normative report UAT |
| REQ-012 | Social Card 2027 | payment channel gate | MVPda disabled; D-07 test |
| REQ-013 | Representative | legal_representative_link | valid/expired/unauthorized |
| REQ-014 | Historical usage | historical_usage_import/line | count/checksum/sign-off |
| REQ-015 | Identity/residency | identity_verification | citizen/resident/stateless matrix |
| REQ-016 | Saga/reconciliation | inbox, outbox, reconciliation_case | lost ACK/orphan/out-of-order |
| REQ-017 | Budget/handoff | claim, payment_handoff | accepted amount/idempotent handoff |
| REQ-018 | Rail 4-ilova scope | policy/reference gate | D-06 owner/API/fallback test |

Har PR quyidagi mappingni ko‘rsatadi:

```text
REQ-ID -> ADR/contract -> migration/table -> backend use case -> frontend screen -> automated test -> operational metric
```

## 23. AI agentning majburiy ish tartibi

Agent har work package’da quyidagi tartibda ishlaydi:

1. `pwd` va git statusni tekshiradi.
2. Userning mavjud o‘zgarishlarini aniqlaydi va saqlaydi.
3. Kanonik spetsifikatsiya hashini tekshiradi.
4. Tegishli REQ-ID va D-gatelarni topadi.
5. Ochiq masalani taxmin qilmaydi.
6. ADR yoki contract change’ni yozadi.
7. OpenAPI va event JSON Schema’ni yangilaydi.
8. DB migration va constraint yozadi.
9. Domain state-machine/invariant testini yozadi.
10. Application use case’ni yozadi.
11. API adapter/controller yozadi.
12. Idempotency, audit va outboxni qo‘shadi.
13. Permission/tenant testini yozadi.
14. Generated frontend clientni yangilaydi.
15. Role-based UI/composable/store yozadi.
16. Metrics, alerts va runbookni yangilaydi.
17. Unit/integration/e2e testlarni ishga tushiradi.
18. Typecheck va production buildni ishga tushiradi.
19. Traceability matrixni yangilaydi.
20. Faqat barcha acceptance criteria bajarilganda Done deb belgilaydi.

## 24. Agent uchun stop conditions

Agent quyidagi holatlarda production behaviorni uydirmaydi va ishni tegishli joyda to‘xtatadi:

1. Kanonik hash mos emas.
2. Kanonik spetsifikatsiya va bu reja zid.
3. D-01 talab qilinadi, ammo rasmiy katalog/ownership yo‘q.
4. D-02 talab qilinadi, ammo mixed-mode/year/C11/companion talqini yo‘q.
5. D-03 talab qilinadi, ammo settlement-basis/formula/deadline tasdiqlanmagan.
6. D-04 talab qilinadi, ammo reviewer/hujjat/SLA vakolati yo‘q.
7. D-05 talab qilinadi, ammo history sign-off/transition yo‘q.
8. D-06 rail qo‘shimcha scope owneri noma’lum.
9. Finance AT contracti, authenticationi yoki status mappingi tasdiqlanmagan.
10. Identity/residency authoritative source tasdiqlanmagan.
11. ERI verification usuli tasdiqlanmagan.
12. Retention/destruction bo‘yicha yuridik qaror kerak bo‘lgan destructive feature so‘ralgan.
13. User o‘zgarishlari bilan xavfli conflict bor.
14. Destructive migration uchun explicit approval yo‘q.
15. Vazifa bank payment executionini yoki Social Card 2027ni MVPga qo‘shishga urinmoqda.

Stop holatida agent:

- bajarilgan xavfsiz ishni saqlaydi;
- bloklovchi REQ/D-IDni ko‘rsatadi;
- kerakli qaror yoki contractni aniq sanaydi;
- draft/sandbox flagni productionga aylantirmaydi.

## 25. Definition of Done

Feature Done bo‘lishi uchun:

- requirement va gate mapping bor;
- OpenAPI/event schema bor;
- backward compatibility tekshirilgan;
- migration va constraint bor;
- domain invariant kodda bor;
- idempotency bor;
- authorization/tenant scope bor;
- audit va correlation bor;
- outbox/inbox kerakli joyda bor;
- PII redaction bor;
- frontend real APIga ulangan;
- reference qiymatlar hardcode qilinmagan;
- unit test bor;
- integration test bor;
- negative/security test bor;
- e2e role flow bor;
- metrics/alert bor;
- runbook bor;
- typecheck/build/test o‘tgan;
- traceability yangilangan;
- ochiq D-gate production feature’ni bloklaydi;
- reviewer acceptance qayd etilgan.

MVP Done bo‘lishi uchun qo‘shimcha ravishda:

- barcha source va pilot carrierlar sertifikatsiyadan o‘tgan;
- historical migration yoki formal transition imzolangan;
- global ledger concurrency testi o‘tgan;
- settlement D-03 asosida ishlaydi yoki production handoff bloklangan;
- immutable claim finance ATiga idempotent topshirilgan;
- external technical ACK/NACK qayta ishlangan;
- post-payment status webhook va PAID/REVERSED UI deploy qilinmagan;
- bank payment execution kodi yo‘q;
- Social Card real-time payment o‘chiq;
- DR/restore mashqi o‘tgan;
- security critical finding yo‘q;
- production readiness va go-live checklist imzolangan.

## 26. Yakuniy arxitektura mezoni

Agentning yakuniy tizimi quyidagi formula bilan tekshiriladi:

> versiyalangan legal-basis va policy + umumtransport atomar entitlement-ledger + to‘liq ticket/qatnov lifecycle + normativ dalil va tasdiqlangan settlement-basis + immutable claim + finance handoff + append-only audit.

Tizim faqat `kontingent POST + yes/no API + ticket POST + oylik summa` ko‘rinishida qolsa, ushbu reja bajarilgan hisoblanmaydi.
