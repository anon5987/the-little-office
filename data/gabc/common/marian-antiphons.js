/**
 * Marian Antiphons GABC
 *
 * Four seasonal antiphons sung after Compline:
 * - Alma Redemptoris Mater (Advent 1 → Feb 2)
 * - Ave Regina Caelorum (Feb 2 → Easter)
 * - Regina Caeli Laetare (Easter → Trinity)
 * - Salve Regina (Trinity → Advent 1)
 *
 * Each antiphon has associated versicle(s) and prayer(s).
 * Alma Redemptoris has two variants: Advent and Christmas.
 */

export default {
  // Alma Redemptoris Mater (Advent 1 Vespers → Feb 2)
  'alma-redemptoris-mater': `name:Alma Redemptoris;
mode:5;
%%
(c4) Al(c/ef/gh)ma(g) *() Re(g)dem(g)ptó(h)ris(i) Ma(j)ter,(g) (;) quæ(e) pér(e)vi(e)a(f) cæ(e)li(d) por(e)ta(f) ma(h)nes,(g) (,) et(h) stel(j)la(i) ma(h)ris,(g) (;) suc(e)cúr(f)re(e) ca(d)dén(e)ti(g) (,) súr(e)ge(f)re(g) qui(h) cu(j)rat(i) pó(k)pu(j)lo:(j) (:) Tu(j) quæ(i) ge(j)nu(j)í(k)sti,(g) (,) na(j)tú(i)ra(h) mi(g)rán(f)te,(e) (,) tu(e)um(e) san(h)ctum(g) Ge(f)ni(e)tó(de)rem,(fe) (:) Vir(j)go(i) pri(h)us(g) ac(h) po(g)sté(e)ri(f)us,(g) (;) Ga(h)bri(h)é(j)lis(h) ab(g) o(f)re(e) (,) su(f)mens(e) il(g)lud(g) A(h)ve,(g) (;) pec(j)ca(i)tó(j)rum(hg) mi(h)se(f)ré(ed)re.(c) (::)`,

  'alma-redemptoris-versicle-advent': `%%
(c4) TODO()`,

  'alma-redemptoris-prayer-advent': `%%
(c4) TODO()`,

  'alma-redemptoris-versicle-christmas': `%%
(c4) TODO()`,

  'alma-redemptoris-prayer-christmas': `%%
(c4) TODO()`,

  // Ave Regina Caelorum (Feb 2 → Easter Vigil)
  'ave-regina-caelorum': `name:Ave Regina caelorum (simple tone);
mode:6;
%%
(c4) A(f)ve(e') Re(d)gí(c')na(d) cae(f')ló(g)rum,(f.) *(;) A(h')ve(j) Dó(ixi')mi(g)na(h') An(g)ge(f')ló(h)rum :(g.) (;) Sal(f)ve(e') ra(d)dix,(c') sal(d)ve(f') por(g)ta,(f'_) (;) Ex(h) qua(g') mun(ixi)do(h') lux(g) est(d') or(g)ta :(f.) (:) Gau(f)de(g') Vir(h)go(h') glo(g)ri(h')ó(ixi)sa,(h'_) (;) Su(j)per(ixi') o(h)mnes(g') spe(f)ci(d')ó(g)sa :(f.) (:) Va(ixi)le,(h') o(g) val(ixi)de(h') de(g)có(f!gwh)ra,(h.) (;) Et(j) pro(ixi) no(ixijk)bis(h'_) Chri(h)stum(g') ex(f)ó(gg)ra.(f.) (::)`,

  'ave-regina-versicle': `initial-style: 1;
%%
(c3)Di(h)gna(h)re(h) me(h) lau(h)da(h)re(h) te,(h) Vir(h)go(h) sa(h)cra(h)ta.(f.) <i>R.</i> (::)
Da(h) mi(h)hi(h) vir(h)tu(h)tem(h) con(h)tra(h) ho(h)stes(h) tu(h)os.(f.) (::)`,

  'ave-regina-prayer': `initial-style: 1;
%%
(c3)O(h)re(h)mus.(h) (::)
Con(h)ce(h)de,(h) mi(h)se(h)ri(h)cors(h) De(h)us,(h) fra(h)gi(h)li(h)ta(h)ti(h) no(h)strae(h) prae(h)si(f)di(f)um(h) (;) ut,(h) qui(h) san(h)ctae(h) De(h)i(h) Ge(h)ne(h)tri(h)cis(h) me(h)mo(h)ri(g)am(f) a(h)gi(h)mus;(h) (:) in(h)ter(h)ces(h)si(h)o(h)nis(h) e(h)jus(h) au(h)xi(h)li(h)o,(h) a(h) no(h)stris(h) i(h)ni(h)qui(h)ta(h)ti(h)bus(h) re(h)sur(h)ga(h)mus.(f) (:) Per(h) e(h)un(h)dem(h) Chri(h)stum(h) Do(h)mi(h)num(h) no(h)strum.(f.) <i>R.</i> (::)
A(g.)men.(h.) (::)`,

  // Regina Caeli Laetare (Easter → Trinity Sunday)
  'regina-caeli-laetare': `name:Regina caeli (simple tone);
mode:6;
%%
(c4) RE(f)gí(g)na(f') cae(g)li(h.) *() lae(ixi)tá(h)re,(g'_[oh:h]) al(ixi)le(h')lú(g){ia} :(f.) (;) Qui(f)a(j'_) quem(j) me(k')ru(j)í(ixi')sti(h) por(f')tá(g)re,(h'_) al(ixi)le(h')lú(g){ia} :(f.) (:) Re(j)sur(j')ré(k)xit,(j'_) sic(j)ut(f') di(g)xit,(f'_) <nlba>al(g)le(h')lú(ixi){ia} :</nlba>(j.) (;) O(j)ra(f) pro(g') no(ixi)bis(h') De(g)um,(f.) al(e)le(g)lú(gg){ia}.(f.) (::)`,

  'regina-caeli-versicle': `initial-style: 1;
%%
(c3)Di(h)gna(h)re(h) me(h) lau(h)da(h)re(h) te,(h) Vir(h)go(h) sa(h)cra(h)ta.(f.) <i>R.</i> (::)
Da(h) mi(h)hi(h) vir(h)tu(h)tem(h) con(h)tra(h) ho(h)stes(h) tu(h)os.(f.) (::)`,

  'regina-caeli-prayer': `%%
(c4) TODO()`,

  // Salve Regina (Trinity Monday → Advent 1 Eve)
  'salve-regina': `name:Salve Regina (simple tone);
mode:5;
%%
(c4) SAl(c)ve,(e) Re(g')gí(h)na,(g.) *() ma(h)ter(j') mi(i)se(h)ri(g)cór(h')di(g)ae :(g.) (;) Vi(j)ta,(g') dul(h)cé(ff)do,(d.) (;) et(e) spes(f) no(g')stra,(e) sal(e[ll:1]d)ve.(c.) (::) Ad(g) te(h) cla(i')má(j)mus,(g.) (;) éx(h)su(i)les,(j) fí(i')li(h)i(g') He(h)vae.(g.) (::) Ad(j) te(g') sus(h)pi(f')rá(d)mus,(e'_[oh:h]) (;) ge(e)mén(g')tes(h) et(j') flen(h)tes(g'_[oh:h]) (;) in(h) hac(g') la(f)cri(e')má(d)rum(e') val(d)le.(c.) (::) E(g){ia}(h') er(i)go,(j'_) Ad(g)vo(h')cá(j)ta(i') no(h)stra,(g.) (;) il(j)los(g') tu(h)os(f'_) mi(d)se(e')ri(f)cór(g')des(f) ó(h')cu(g)los(g'_[oh:h]) (,) ad(f) nos(e') con(d)vér(e[ll:1]d)te.(c.) (::) Et(g) Je(hi)sum,(jj) be(i)ne(g')dí(h)ctum(g') fru(g)ctum(h') ven(j)tris(i') tu(h)i,(g.) (;) no(c)bis(g'_[oh:h]) post(h) hoc(j') ex(i)sí(h')li(g)um(e'_[oh:h]) os(f)tén(e[ll:1]d)de.(c.) (::) O(e!fwg) cle(ee)mens :(c.) (::) O(g!hwi/ji) pi(hg)a :(g.) (::) O(jjj//ghf'fd) dul(ef)cis(g'_[oh:h]) *(;) Vir(c)go(f') Ma(e)rí(dc)a.(c.) (::)`,

  'salve-regina-versicle': `%%
(c4) TODO()`,

  'salve-regina-prayer': `%%
(c4) TODO()`
};
