//! A ECMAScript WASM implementation based on boa_engine.

#![doc(
    html_logo_url = "https://raw.githubusercontent.com/boa-dev/boa/main/assets/logo.svg",
    html_favicon_url = "https://raw.githubusercontent.com/boa-dev/boa/main/assets/logo.svg"
)]
#![cfg_attr(not(test), forbid(clippy::unwrap_used))]
#![warn(missing_docs, clippy::dbg_macro)]
#![deny(
    // rustc lint groups https://doc.rust-lang.org/rustc/lints/groups.html
    warnings,
    future_incompatible,
    let_underscore,
    nonstandard_style,
    rust_2018_compatibility,
    rust_2018_idioms,
    rust_2021_compatibility,
    unused,

    // rustc allowed-by-default lints https://doc.rust-lang.org/rustc/lints/listing/allowed-by-default.html
    macro_use_extern_crate,
    meta_variable_misuse,
    missing_abi,
    missing_copy_implementations,
    missing_debug_implementations,
    non_ascii_idents,
    noop_method_call,
    single_use_lifetimes,
    trivial_casts,
    trivial_numeric_casts,
    unreachable_pub,
    unsafe_op_in_unsafe_fn,
    unused_crate_dependencies,
    unused_import_braces,
    unused_lifetimes,
    unused_qualifications,
    unused_tuple_struct_fields,
    variant_size_differences,

    // rustdoc lints https://doc.rust-lang.org/rustdoc/lints.html
    rustdoc::broken_intra_doc_links,
    rustdoc::private_intra_doc_links,
    rustdoc::missing_crate_level_docs,
    rustdoc::private_doc_tests,
    rustdoc::invalid_codeblock_attributes,
    rustdoc::invalid_rust_codeblocks,
    rustdoc::bare_urls,

    // clippy categories https://doc.rust-lang.org/clippy/
    clippy::all,
    clippy::correctness,
    clippy::suspicious,
    clippy::style,
    clippy::complexity,
    clippy::perf,
    clippy::pedantic,
    clippy::nursery,
)]

mod utils;

use boa_engine::{Context, Source};
use getrandom as _;
use wasm_bindgen::prelude::*;
use wasm_bindgen_test::__rt::js_console_log;
use utils::set_panic_hook;
use js_sys::Array;

fn vec_to_js_array(vec: Vec<String>) -> Array {
    vec.into_iter().map(JsValue::from).collect()    
}

/// Evaluate the given ECMAScript code.
#[wasm_bindgen]
pub fn evaluate(src: &str, cu_limit: u64) -> Result<Array, JsValue> {
    set_panic_hook();
    js_console_log("__sk__ inited");
    // Setup executor
    let mut ctx = Context::builder().build_sk(cu_limit).expect("Building the default context should not fail");
    let result = ctx.eval_script(Source::from_bytes(src));
    let cu_cost = ctx.get_cu_used().to_string();
    // js_console_log(&format!("cu cost: {}", cu_cost));
    match result {
        Ok(v) => Ok(vec_to_js_array(vec![v.display().to_string(), cu_cost])),
        Err(e) => Err(JsValue::from(format!("Uncaught {}", e)))
    }
}